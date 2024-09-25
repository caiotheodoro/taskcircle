'use server';

import { revalidatePath } from 'next/cache';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { action } from '@/lib/safe-action';

import { db } from '..';
import { PostService } from '../messages/posts';
import { comments } from '../schema';

const createCommentSchema = z.object({
  content: z.string().min(1).max(500),
  post_id: z.string(),
  user_id: z.string(),
});

export const createComment = action(
  createCommentSchema,
  async ({ content, post_id, user_id }) => {
    const newComment = await db.insert(comments).values({
      content,
      post_id,
      user_id,
    });

    revalidatePath('/');

    if (!newComment) return { error: PostService.GENERIC_ERROR };
    return { success: PostService.COMMENT_CREATED };
  },
);

const deleteSchema = z.object({
  id: z.string(),
});
export const deleteComment = action(deleteSchema, async ({ id }) => {
  try {
    await db
      .update(comments)
      .set({ deleted_at: new Date() })
      .where(eq(comments.id, id));

    revalidatePath('/');

    return { success: PostService.DELETED };
  } catch (error) {
    return { error: PostService.GENERIC_ERROR };
  }
});
