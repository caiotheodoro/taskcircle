'use server';

import { revalidatePath } from 'next/cache';

import { and, eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { formSchema } from '@/lib/formSchema';
import { db } from '@/server/';
import { auth } from '@/server/auth';

import { organization, posts } from '../schema';

export const action = createSafeActionClient();

export const createPost = action(formSchema, async ({ content, org_id }) => {
  const session = await auth();

  const org = await db.query.organization.findFirst({
    where: eq(organization.id, org_id),
  });

  if (!content || !session?.user?.id || !org?.id)
    return { error: 'Something went wrong' };

  const newPost = await db.insert(posts).values({
    content,
    organization_id: org.id,
    user_id: session.user.id,
  });

  revalidatePath('/' + org.name);

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

export const fetchPosts = async (org_id: string) => {
  const org = await db.query.organization.findFirst({
    where: eq(organization.id, org_id),
  });

  if (!org) return { error: 'Organization not found' };

  const orgPosts = await db.query.posts.findMany({
    with: {
      author: true,
    },
    where: eq(posts.organization_id, org?.id),
    orderBy: (posts, { desc }) => [desc(posts.timestamp)],
  });
  if (!orgPosts) return { error: 'No posts !' };
  if (orgPosts) return { success: orgPosts };
};

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
