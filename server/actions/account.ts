'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { db } from '@/server/';
import {
  accounts,
  organization,
  userOrganizations,
  users,
} from '@/server/schema';

import { auth } from '../auth';
import { MessageService } from '../messages/generic';

export const action = createSafeActionClient();

const nullSchema = z.object({}).optional();
export const deleteAccount = async () => {
  try {
    const session = await auth();

    const userOrgs = await db.query.userOrganizations.findMany({
      where: eq(userOrganizations.user_id, session.user.id),
    });

    let promises: Promise<any>[] = [];

    userOrgs.forEach((userOrg) => {
      promises.push(
        db
          .delete(organization)
          .where(eq(organization.id, userOrg.organization_id)),
      );
    });

    await Promise.all(promises);

    await db.delete(users).where(eq(users.id, session.user.id));
    await db.delete(accounts).where(eq(accounts.userId, session.user.id));
    revalidatePath('/');
    return { success: MessageService.DELETED };
  } catch (error) {
    return { error: MessageService.GENERIC_ERROR };
  }
};
