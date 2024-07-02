'use server';

import { revalidatePath } from 'next/cache';

import { and, eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { orgSchema } from '@/lib/formSchema';
import { db } from '@/server/';
import { auth } from '@/server/auth';
import { OrganizationService } from '@/server/messages/organization';
import {
  Role,
  organization,
  organizationInvites,
  userOrganizations,
} from '@/server/schema';

export const action = createSafeActionClient();

const deleteSchema = z.object({
  id: z.string(),
});

export const deleteOrg = action(deleteSchema, async ({ id }) => {
  try {
    const session = await auth();

    const org = await fetchOrganizationById(id);

    if (!org) return { error: OrganizationService.NOT_FOUND };

    const isAdmin = await checkAdminStatus(session.user.id, org.id);

    if (!isAdmin) return { error: OrganizationService.NOT_ALLOWED };

    await db.delete(organization).where(eq(organization.id, id));
    revalidatePath('/');
    return { success: OrganizationService.DELETED };
  } catch (error) {
    return { error: OrganizationService.GENERIC_ERROR };
  }
});

const deleteMembershipSchema = z.object({
  org_id: z.string(),
  user_id: z.string(),
});

export const deleteMembership = action(
  deleteMembershipSchema,
  async ({ org_id, user_id }) => {
    try {
      const session = await auth();

      const org = await fetchOrganizationById(org_id);
      if (!org) return { error: OrganizationService.NOT_FOUND };

      const isAdmin = await checkAdminStatus(session.user.id, org.id);
      if (!isAdmin) return { error: OrganizationService.NOT_ALLOWED };

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

const getOrganizationSchema = z.object({
  org_name: z.string(),
});

enum ORGANIZATION_STATUS {
  CLAIMABLE = 'claimable',
  CLAIMED = 'claimed',

  OWNED = 'owned',

  MEMBER = 'member',
}

export const getOrganization = action(
  getOrganizationSchema,
  async ({ org_name }) => {
    const session = await auth();

    const org = await fetchOrganizationByName(org_name);

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
  },
);
export const fetchOrganizations = async () => {
  const session = await auth();

  const organizations = await db.query.userOrganizations.findMany({
    where: eq(userOrganizations.user_id, session.user.id),
    with: { organization: true },
    columns: { role: true },
  });

  return organizations
    ? { success: organizations }
    : { error: OrganizationService.NOT_FOUND };
};

export const createOrganization = action(
  orgSchema,
  async ({ description, name, slug }) => {
    const session = await auth();

    const org = await fetchOrganizationByName(name);

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

const checkAdminStatus = async (userId, orgId) => {
  const userOrg = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.user_id, userId),
      eq(userOrganizations.organization_id, orgId),
    ),
  });

  return userOrg && userOrg.role === Role.ADMIN;
};

const fetchOrganizationById = async (orgId) => {
  return await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
  });
};

const fetchOrganizationByName = async (orgName) => {
  return await db.query.organization.findFirst({
    where: eq(organization.name, orgName),
  });
};
