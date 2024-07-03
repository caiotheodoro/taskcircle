import { and, eq } from 'drizzle-orm';

import { db } from '@/server/';

import { Role, organization, userOrganizations } from '../schema';

export const checkAdminStatus = async (userId: string, orgId: string) => {
  const userOrg = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.user_id, userId),
      eq(userOrganizations.organization_id, orgId),
    ),
  });

  return userOrg && userOrg.role === Role.ADMIN;
};

export const fetchOrganizationById = async (orgId: string) => {
  return await db.query.organization.findFirst({
    where: eq(organization.id, orgId),
  });
};
