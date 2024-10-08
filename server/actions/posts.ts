'use server';

import { revalidatePath } from 'next/cache';

import { eq, isNull } from 'drizzle-orm';
import * as z from 'zod';

import { formSchema } from '@/lib/formSchema';
import { action } from '@/lib/safe-action';
import { db } from '@/server/';
import { auth } from '@/server/auth';
import { OrganizationService } from '@/server/messages/organization';
import { PostService } from '@/server/messages/posts';
import { posts } from '@/server/schema';
import { comments } from '@/server/schema';

import { fetchOrganizationById } from './shared';

export const createPost = action(formSchema, async ({ content, org_id }) => {
  const session = await auth();
  const org = await fetchOrganizationById(org_id);

  if (!content || !session?.user?.id || !org?.id)
    return { error: PostService.GENERIC_ERROR };

  const newPost = await db.insert(posts).values({
    content,
    organization_id: org.id,
    user_id: session.user.id,
  });

  revalidatePath('/' + org.name);

  if (!newPost) return { error: PostService.GENERIC_ERROR };
  if (newPost[0]) return { success: PostService.CREATED };
});

const deleteSchema = z.object({
  id: z.string(),
});
export const deletePost = action(deleteSchema, async ({ id }) => {
  try {
    await db.delete(posts).where(eq(posts.id, id));

    revalidatePath('/');
    return { success: PostService.DELETED };
  } catch (error) {
    return { error: PostService.GENERIC_ERROR };
  }
});

export const fetchPosts = async (org_id) => {
  const org = await fetchOrganizationById(org_id);

  if (!org) return { error: OrganizationService.NOT_FOUND };

  const orgPosts = await db.query.posts.findMany({
    with: {
      author: true,
      updatedBy: true,
      comments: {
        with: {
          author: true,
        },
        orderBy: (comments, { asc }) => [asc(comments.created_at)],
        where: isNull(comments.deleted_at),
      },
    },
    where: eq(posts.organization_id, org.id),
    orderBy: (posts, { desc }) => [desc(posts.timestamp)],
  });

  revalidatePath('/');

  if (!orgPosts) return { error: PostService.NOT_FOUND };
  return { success: orgPosts };
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
      .set({ status, updatedBy: user_id, updatedAt: new Date() })
      .where(eq(posts.id, post_id));

    revalidatePath('/');

    if (!updatedPost) return { error: PostService.GENERIC_ERROR };
    return { success: PostService.UPDATED };
  },
);
