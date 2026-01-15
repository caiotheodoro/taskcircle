'use server';

import { revalidatePath } from 'next/cache';

import { and, desc, eq } from 'drizzle-orm';
import * as z from 'zod';

import { earningSchema, spendingSchema } from '@/lib/formSchema';
import { action } from '@/lib/safe-action';
import { db } from '@/server/';
import { auth } from '@/server/auth';
import {
  EarningType,
  SpendingType,
  earnings,
  spendings,
} from '@/server/schema';

export const createEarning = action(earningSchema, async (data) => {
  const session = await auth();

  if (!session?.user?.id) return { error: 'Unauthorized' };

  const newEarning = await db.insert(earnings).values({
    user_id: session.user.id,
    amount: data.amount,
    description: data.description,
    type: data.type as EarningType,
    month: data.month,
    year: data.year,
  });

  revalidatePath('/financial');

  if (!newEarning) return { error: 'Failed to create earning' };
  return { success: 'Earning created successfully' };
});

export const createSpending = action(spendingSchema, async (data) => {
  const session = await auth();

  if (!session?.user?.id) return { error: 'Unauthorized' };

  if (data.type === 'installment') {
    if (!data.installment_current || !data.installment_total) {
      return {
        error:
          'Installment current and total are required for installment type',
      };
    }
  }

  const newSpending = await db.insert(spendings).values({
    user_id: session.user.id,
    amount: data.amount,
    description: data.description,
    type: data.type as SpendingType,
    month: data.month,
    year: data.year,
    installment_current: data.installment_current || null,
    installment_total: data.installment_total || null,
  });

  revalidatePath('/financial');

  if (!newSpending) return { error: 'Failed to create spending' };
  return { success: 'Spending created successfully' };
});

export const fetchFinances = async () => {
  const session = await auth();

  if (!session?.user?.id) return { error: 'Unauthorized' };

  const userEarnings = await db.query.earnings.findMany({
    where: eq(earnings.user_id, session.user.id),
    orderBy: [desc(earnings.created_at)],
  });

  const userSpendings = await db.query.spendings.findMany({
    where: eq(spendings.user_id, session.user.id),
    orderBy: [desc(spendings.created_at)],
  });

  return { success: { earnings: userEarnings, spendings: userSpendings } };
};

const deleteEarningSchema = z.object({
  id: z.string(),
});

export const deleteEarning = action(deleteEarningSchema, async ({ id }) => {
  try {
    const session = await auth();

    if (!session?.user?.id) return { error: 'Unauthorized' };

    await db
      .delete(earnings)
      .where(and(eq(earnings.id, id), eq(earnings.user_id, session.user.id)));

    revalidatePath('/financial');
    return { success: 'Earning deleted successfully' };
  } catch (error) {
    return { error: 'Failed to delete earning' };
  }
});

const deleteSpendingSchema = z.object({
  id: z.string(),
});

export const deleteSpending = action(deleteSpendingSchema, async ({ id }) => {
  try {
    const session = await auth();

    if (!session?.user?.id) return { error: 'Unauthorized' };

    await db
      .delete(spendings)
      .where(and(eq(spendings.id, id), eq(spendings.user_id, session.user.id)));

    revalidatePath('/financial');
    return { success: 'Spending deleted successfully' };
  } catch (error) {
    return { error: 'Failed to delete spending' };
  }
});
