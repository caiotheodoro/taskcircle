'use server';

import { revalidatePath } from 'next/cache';

import { and, eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { orgSchema } from '@/lib/formSchema';
import { db } from '@/server/';
import { auth } from '@/server/auth';

import { OrganizationService } from '../messages/organization';
import { Role, organization, userOrganizations } from '../schema';

export const action = createSafeActionClient();

const getOrganizationSchema = z.object({
  organization_name: z.string(),
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
    where: eq(organization.name, input.organization_name),
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

  if (!userOrg) return { status: ORGANIZATION_STATUS.CLAIMED };

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
