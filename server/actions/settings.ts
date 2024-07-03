'use server';

import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { db } from '@/server/';
import { SettingsKey, organization, settings } from '@/server/schema';

import { auth } from '../auth';
import { MessageService } from '../messages/generic';
import { checkAdminStatus } from './shared';

export const action = createSafeActionClient();

const deleteCheckJobSchema = z.object({
  enabled: z.boolean(),
  org_id: z.string(),
});

export const changeDeletejobSettings = action(
  deleteCheckJobSchema,
  async ({ enabled, org_id }) => {
    try {
      const session = await auth();

      const isAdmin = await checkAdminStatus(session.user.id, org_id);

      if (!isAdmin) return { error: MessageService.UNAUTHORIZED };

      await db
        .insert(settings)
        .values({
          organization_id: org_id,
          enabled: enabled,
          key: SettingsKey.DELETE_CHECKED_POSTS,
        })
        .onConflictDoUpdate({
          target: [settings.organization_id, settings.key],
          set: { enabled: enabled },
        });

      return { success: MessageService.UPDATED };
    } catch (error) {
      return { error: MessageService.GENERIC_ERROR };
    }
  },
);

export const listSettings = action(
  z.object({
    org_name: z.string(),
  }),
  async ({ org_name }) => {
    const org = await fetchOrganizationByName(org_name);

    if (!org) return { error: MessageService.NOT_FOUND };

    const session = await auth();

    const isAdmin = await checkAdminStatus(session.user.id, org.id);

    if (!isAdmin) return { error: MessageService.UNAUTHORIZED };

    const settingsList = await db.query.settings.findMany({
      where: eq(settings.organization_id, org.id),
    });

    if (!settingsList) return { success: [] };

    return { success: settingsList };
  },
);

const fetchOrganizationByName = async (orgName) => {
  return await db.query.organization.findFirst({
    where: eq(organization.name, orgName),
  });
};
