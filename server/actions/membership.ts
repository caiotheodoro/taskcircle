'use server';

import { headers } from 'next/headers';

import { Ratelimit } from '@upstash/ratelimit';
import { and, eq, gt, ne } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

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

const checkAdminStatus = async (userId: string, orgId: string) => {
  const userOrg = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.user_id, userId),
      eq(userOrganizations.organization_id, orgId),
    ),
  });

  return userOrg && userOrg.role === Role.ADMIN;
};

const fetchOrganizationById = async (orgId: string) => {
  return await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
  });
};

const createOrganizationInvite = async (orgId: string, userId: string) => {
  return await db.insert(organizationInvites).values({
    organization_id: orgId,
    user_id: userId,
  });
};

export const requestMembership = action(
  z.object({
    org_id: z.string(),
    otp: z.string(),
  }),
  async ({ org_id, otp }) => {
    try {
      const ip = headers().get('x-forwarded-for');
      const { remaining } = await rateLimit.limit(ip);
      if (remaining === 0) return { error: MessageService.LIMIT_REACHED };

      const session = await auth();
      const org = await fetchOrganizationById(org_id);

      if (!org) return { error: OrganizationService.NOT_FOUND };

      if (otp.toUpperCase() !== org.otp)
        return {
          error: OrganizationService.INVALID_OTP,
          retries: remaining - 1,
        };

      const orgInvite = await createOrganizationInvite(org.id, session.user.id);

      if (!orgInvite)
        return { error: OrganizationService.ERROR_CREATING_INVITE };

      return { success: OrganizationService.CREATED };
    } catch (error) {
      return { error: OrganizationService.GENERIC_ERROR };
    }
  },
);

export const listUsersAndPendingInvites = action(
  z.object({
    org_name: z.string(),
  }),
  async ({ org_name }) => {
    try {
      const session = await auth();
      const org = await db.query.organization.findFirst({
        where: eq(organization.name, org_name),
      });

      if (!org) return { error: OrganizationService.NOT_FOUND };

      const isAdmin = await checkAdminStatus(session.user.id, org.id);
      if (!isAdmin) return { error: OrganizationService.NOT_ALLOWED };

      const users = await db.query.userOrganizations.findMany({
        where: and(
          eq(userOrganizations.organization_id, org.id),
          ne(userOrganizations.user_id, session.user.id),
        ),
        with: { user: true },
      });

      const invites = await db.query.organizationInvites.findMany({
        where: and(
          eq(organizationInvites.organization_id, org.id),
          eq(organizationInvites.status, OrganizationInviteStatus.PENDING),
          gt(organizationInvites.expires_at, new Date()),
        ),
        with: { user: true },
      });

      return { success: { users, invites } };
    } catch (error) {
      return { error: OrganizationService.GENERIC_ERROR };
    }
  },
);

export const changePendingInvite = action(
  z.object({
    org_id: z.string(),
    user_id: z.string(),
    status: z.enum([
      OrganizationInviteStatus.ACCEPTED,
      OrganizationInviteStatus.REJECTED,
      OrganizationInviteStatus.PENDING,
    ]),
  }),
  async ({ org_id, user_id, status }) => {
    try {
      const session = await auth();
      const org = await fetchOrganizationById(org_id);

      if (!org) return { error: OrganizationService.NOT_FOUND };

      const isAdmin = await checkAdminStatus(session.user.id, org.id);
      if (!isAdmin) return { error: OrganizationService.NOT_ALLOWED };

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

export const deleteMembership = action(
  z.object({
    org_id: z.string(),
    user_id: z.string(),
  }),
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
