'use server';

import { and, eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { db } from '@/server/';
import { auth } from '@/server/auth';

import { organization, userOrganizations } from '../schema';

export const action = createSafeActionClient();

export enum ORGANIZATION_STATUS {
  CLAIMABLE = 'claimable',
  CLAIMED = 'claimed',

  OWNED = 'owned',
}

const getOrganizationSchema = z.object({
  organization_name: z.string(),
});

export const fetchOrganizations = async () => {
  const session = await auth();
  const organizations = await db.query.organization.findMany({
    with: {
      users: {
        where: eq(userOrganizations.user_id, session.user.id),
      },
    },
    columns: {
      name: true,
    },
  });

  if (!organizations) return { error: 'No organizations found' };
  return { success: organizations.map((org) => org.name) };
};

export const getOrganization = action(getOrganizationSchema, async (input) => {
  const session = await auth();

  const org = await db.query.organization.findFirst({
    where: eq(organization.name, input.organization_name),
  });

  if (!org) return { data: ORGANIZATION_STATUS.CLAIMABLE };

  const owned = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.user_id, session.user.id),
      eq(userOrganizations.organization_id, org.id),
    ),
  });

  if (owned) return { data: ORGANIZATION_STATUS.OWNED };

  return { data: ORGANIZATION_STATUS.CLAIMED };
});
