'use server';

import { revalidatePath } from 'next/cache';

import { and, desc, eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { formSchema } from '@/lib/formSchema';
import { db } from '@/server/';
import { auth } from '@/server/auth';

import { posts, warnings } from '../schema';

export const action = createSafeActionClient();

export const createPost = action(formSchema, async ({ content }) => {
  const session = await auth();
  console.log(session?.user?.id);
  if (!content || !session?.user?.id) return { error: 'Something went wrong' };
  const newPost = await db.insert(posts).values({
    content,
    user_id: session.user.id,
  });
  revalidatePath('/');
  if (!newPost) return { error: 'Could not create post' };
  if (newPost[0]) return { success: 'Post Created' };
});

const deleteSchema = z.object({
  id: z.string(),
});
export const deletePost = action(deleteSchema, async ({ id }) => {
  try {
    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath('/');
    return { success: 'Product deleted' };
  } catch (error) {
    return { error: 'Something went wrong' };
  }
});

export const fetchPosts = async () => {
  const posts = await db.query.posts.findMany({
    with: {
      author: true,
      warnings: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.timestamp)],
  });
  if (!posts) return { error: 'No posts !' };
  if (posts) return { success: posts };
};

const addWarningSchema = z.object({
  post_id: z.string(),
  user_id: z.string(),
});

export const addWarning = action(
  addWarningSchema,
  async ({ post_id, user_id }) => {
    const existingWarning = await db.query.warnings.findFirst({
      where: and(eq(warnings.post_id, post_id), eq(warnings.user_id, user_id)),
    });
    if (existingWarning) {
      await db.delete(warnings).where(eq(warnings.id, existingWarning.id));
      revalidatePath('/');
      return { success: 'Removed Warning' };
    }

    if (!existingWarning) {
      const warning = await db
        .insert(warnings)
        .values({
          post_id,
          user_id,
        })
        .returning()
        .catch((error) => {
          if (error) return { error: error };
        });

      revalidatePath('/');
      return { success: warning };
    }
  },
);

const changeStatusSchema = z.object({
  status: z.boolean(),
  post_id: z.string(),
  user_id: z.string(),
});

export const changePostStatus = action(
  changeStatusSchema,
  async ({ status, post_id, user_id }) => {
    const updatedPost = await db
      .update(posts)
      .set({ status, updatedBy: user_id })
      .where(eq(posts.id, post_id));
    revalidatePath('/');
    if (!updatedPost) return { error: 'Could not update post' };
    if (updatedPost) return { success: 'Post updated' };
  },
);