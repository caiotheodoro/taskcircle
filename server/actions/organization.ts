'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { Ratelimit } from '@upstash/ratelimit';
import { and, eq, gt, ne } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { orgSchema } from '@/lib/formSchema';
import { db } from '@/server/';
import { auth } from '@/server/auth';
import { MessageService } from '@/server/messages/generic';
import { OrganizationService } from '@/server/messages/organization';
import {
  OrganizationInviteStatus,
  Role,
  organization,
  organizationInvites,
  userOrganizations,
} from '@/server/schema';
import { redis } from '@/server/upstash';

export const action = createSafeActionClient();

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(6, '120s'),
});

const getOrganizationSchema = z.object({
  org_name: z.string(),
});

enum ORGANIZATION_STATUS {
  CLAIMABLE = 'claimable',
  CLAIMED = 'claimed',

  OWNED = 'owned',

  MEMBER = 'member',
}

export const getOrganization = action(getOrganizationSchema, async (input) => {
  const session = await auth();

  const org = await db.query.organization.findFirst({
    where: eq(organization.name, input.org_name),
  });

  if (!org)
    return {
      status: ORGANIZATION_STATUS.CLAIMABLE,
    };

  const userOrg = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.user_id, session.user.id),
      eq(userOrganizations.organization_id, org.id),
    ),
  });

  if (!userOrg) {
    const orgInvite = await db.query.organizationInvites.findFirst({
      where: and(
        eq(organizationInvites.organization_id, org.id),
        eq(organizationInvites.user_id, session.user.id),
      ),
    });

    return {
      status: ORGANIZATION_STATUS.CLAIMED,
      organization: {
        id: org.id,
        name: org.name,
        inviteStatus: orgInvite?.status,
      },
    };
  }

  if (userOrg.role === Role.ADMIN)
    return {
      status: ORGANIZATION_STATUS.OWNED,
      organization: { ...org, role: userOrg.role },
    };
  if (userOrg.role === Role.MEMBER)
    return {
      status: ORGANIZATION_STATUS.MEMBER,
      organization: { ...org, role: userOrg.role },
    };
});

export const fetchOrganizations = async () => {
  const session = await auth();

  const organizations = await db.query.userOrganizations.findMany({
    where: eq(userOrganizations.user_id, session.user.id),
    with: {
      organization: true,
    },
    columns: {
      role: true,
    },
  });

  if (!organizations) return { error: OrganizationService.NOT_FOUND };
  return { success: organizations };
};

export const createOrganization = action(
  orgSchema,
  async ({ description, name, slug }) => {
    const session = await auth();

    const org = await db.query.organization.findFirst({
      where: eq(organization.name, name),
    });

    if (org) return { error: OrganizationService.CLAIMED };

    const createdOrg = await db
      .insert(organization)
      .values({
        name,
        slug,
        description,
      })
      .returning();

    if (!createdOrg) return { error: OrganizationService.ERROR_CREATING };

    const userOrg = await db.insert(userOrganizations).values({
      organization_id: createdOrg[0].id,
      user_id: session.user.id,
      role: Role.ADMIN,
    });

    if (!userOrg) return { error: OrganizationService.ERROR_CREATING };

    revalidatePath('/' + name);

    if (userOrg[0]) return { success: OrganizationService.CREATED };
  },
);

const deleteSchema = z.object({
  id: z.string(),
});
export const deleteOrg = action(deleteSchema, async ({ id }) => {
  try {
    await db.delete(organization).where(eq(organization.id, id));
    revalidatePath('/');
    return { success: OrganizationService.DELETED };
  } catch (error) {
    return { error: OrganizationService.GENERIC_ERROR };
  }
});

const requestMembershipSchema = z.object({
  org_id: z.string(),
  otp: z.string(),
});
export const requestMembership = action(
  requestMembershipSchema,
  async ({ org_id, otp }) => {
    try {
      const ip = headers().get('x-forwarded-for');
      const { remaining } = await rateLimit.limit(ip);
      if (remaining === 0) return { error: MessageService.LIMIT_REACHED };

      const session = await auth();

      const org = await db.query.organization.findFirst({
        where: eq(organization.id, org_id),
      });

      if (!org) return { error: OrganizationService.NOT_FOUND };

      if (otp.toUpperCase() !== org.otp)
        return {
          error: OrganizationService.INVALID_OTP,
          retries: remaining - 1,
        };

      const orgInvite = await db.insert(organizationInvites).values({
        organization_id: org.id,
        user_id: session.user.id,
      });

      if (!orgInvite)
        return { error: OrganizationService.ERROR_CREATING_INVITE };

      return { success: OrganizationService.CREATED };
    } catch (error) {
      return { error: OrganizationService.GENERIC_ERROR };
    }
  },
);

const listUsersAndPendingInvitesSchema = z.object({
  org_name: z.string(),
});
export const listUsersAndPendingInvites = action(
  listUsersAndPendingInvitesSchema,
  async ({ org_name }) => {
    try {
      const session = await auth();

      const org = await db.query.organization.findFirst({
        where: eq(organization.name, org_name),
      });

      console.log(org);

      if (!org) return { error: OrganizationService.NOT_FOUND };

      const currUser = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.user_id, session.user.id),
          eq(userOrganizations.organization_id, org.id),
        ),
      });

      console.log(currUser);

      if (currUser.role !== Role.ADMIN)
        return { error: OrganizationService.NOT_ALLOWED };

      const users = await db.query.userOrganizations.findMany({
        where: and(
          eq(userOrganizations.organization_id, org.id),
          ne(userOrganizations.user_id, session.user.id),
        ),
        with: {
          user: true,
        },
      });

      const invites = await db.query.organizationInvites.findMany({
        where: and(
          eq(organizationInvites.organization_id, org.id),
          eq(organizationInvites.status, OrganizationInviteStatus.PENDING),
          gt(organizationInvites.expires_at, new Date()),
        ),
        with: {
          user: true,
        },
      });

      console.log(invites);

      return { success: { users, invites } };
    } catch (error) {
      return { error: OrganizationService.GENERIC_ERROR };
    }
  },
);

const changePendingInviteSchema = z.object({
  org_id: z.string(),
  user_id: z.string(),
  status: z.enum([
    OrganizationInviteStatus.ACCEPTED,
    OrganizationInviteStatus.REJECTED,
    OrganizationInviteStatus.PENDING,
  ]),
});

export const changePendingInvite = action(
  changePendingInviteSchema,
  async ({ org_id, user_id, status }) => {
    try {
      const session = await auth();

      const org = await db.query.organization.findFirst({
        where: eq(organization.id, org_id),
      });

      if (!org) return { error: OrganizationService.NOT_FOUND };

      const currUser = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.user_id, session.user.id),
          eq(userOrganizations.organization_id, org.id),
        ),
      });

      if (currUser.role !== Role.ADMIN)
        return { error: OrganizationService.NOT_ALLOWED };

      const invite = await db.query.organizationInvites.findFirst({
        where: and(
          eq(organizationInvites.organization_id, org.id),
          eq(organizationInvites.user_id, user_id),
          gt(organizationInvites.expires_at, new Date()),
        ),
      });

      if (!invite) return { error: OrganizationService.NOT_FOUND };

      if (status === OrganizationInviteStatus.ACCEPTED) {
        await db.insert(userOrganizations).values({
          organization_id: org.id,
          user_id: user_id,
          role: Role.MEMBER,
        });
      }

      await db
        .delete(organizationInvites)
        .where(
          and(
            eq(organizationInvites.organization_id, org.id),
            eq(organizationInvites.user_id, user_id),
          ),
        );

      return { success: OrganizationService.UPDATED };
    } catch (error) {
      return { error: OrganizationService.GENERIC_ERROR };
    }
  },
);

const deleteMembershipSchema = z.object({
  org_id: z.string(),
  user_id: z.string(),
});

export const deleteMembership = action(
  deleteMembershipSchema,
  async ({ org_id, user_id }) => {
    try {
      const session = await auth();

      const org = await db.query.organization.findFirst({
        where: eq(organization.id, org_id),
      });

      if (!org) return { error: OrganizationService.NOT_FOUND };

      const currUser = await db.query.userOrganizations.findFirst({
        where: and(
          eq(userOrganizations.user_id, session.user.id),
          eq(userOrganizations.organization_id, org.id),
        ),
      });

      if (currUser.role !== Role.ADMIN)
        return { error: OrganizationService.NOT_ALLOWED };

      await db
        .delete(userOrganizations)
        .where(
          and(
            eq(userOrganizations.organization_id, org.id),
            eq(userOrganizations.user_id, user_id),
          ),
        );

      return { success: OrganizationService.UPDATED };
    } catch (error) {
      return { error: OrganizationService.GENERIC_ERROR };
    }
  },
);
