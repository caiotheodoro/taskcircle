'use server';

import { revalidatePath } from 'next/cache';

import { and, eq } from 'drizzle-orm';
import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';

import { formSchema } from '@/lib/formSchema';
import { db } from '@/server/';
import { auth } from '@/server/auth';

import {
  Role,
  organization,
  posts,
  userOrganizations,
  warnings,
} from '../schema';

export const action = createSafeActionClient();

export const createPost = action(
  formSchema,
  async ({ content, currentOrg }) => {
    const session = await auth();

    const org = await db.query.organization.findFirst({
      where: eq(organization.name, currentOrg),
    });

    if (!content || !session?.user?.id)
      return { error: 'Something went wrong' };

    const newPost = await db.insert(posts).values({
      content,
      organization_id: org.id,
      user_id: session.user.id,
    });

    revalidatePath('/' + currentOrg);

    if (!newPost) return { error: 'Could not create post' };
    if (newPost[0]) return { success: 'Post Created' };
  },
);

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

export const fetchPosts = async (currentOrg: string) => {
  console.log(currentOrg);
  const org = await db.query.organization.findFirst({
    where: eq(organization.name, currentOrg),
  });

  console.log('org', org);

  if (!org) return { error: 'Organization not found' };

  const orgPosts = await db.query.posts.findMany({
    with: {
      author: true,
      warnings: true,
    },
    where: eq(posts.organization_id, org?.id),
    orderBy: (posts, { desc }) => [desc(posts.timestamp)],
  });
  if (!orgPosts) return { error: 'No posts !' };
  if (orgPosts) return { success: orgPosts };
};

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

  if (!organizations) return { error: 'No organizations found' };
  return { success: organizations };
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

enum ORGANIZATION_STATUS {
  CLAIMABLE = 'claimable',
  CLAIMED = 'claimed',

  OWNED = 'owned',

  MEMBER = 'member',
}

const getOrganizationSchema = z.object({
  organization_name: z.string(),
});

export const getOrganization = action(getOrganizationSchema, async (input) => {
  const session = await auth();

  const org = await db.query.organization.findFirst({
    where: eq(organization.name, input.organization_name),
  });

  if (!org) return ORGANIZATION_STATUS.CLAIMABLE;

  const userOrg = await db.query.userOrganizations.findFirst({
    where: and(
      eq(userOrganizations.user_id, session.user.id),
      eq(userOrganizations.organization_id, org.id),
    ),
  });

  if (userOrg.role === Role.ADMIN) return ORGANIZATION_STATUS.OWNED;
  if (userOrg.role === Role.MEMBER) return ORGANIZATION_STATUS.MEMBER;

  return ORGANIZATION_STATUS.CLAIMED;
});
