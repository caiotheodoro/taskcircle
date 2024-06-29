import type { AdapterAccount } from '@auth/core/adapters';
import { createId, init } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';
import { primaryKey, timestamp } from 'drizzle-orm/pg-core';

const cre = init({ length: 5 });
export const posts = pgTable('posts', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
  status: boolean('status').default(false),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organization.id, {
      onDelete: 'cascade',
    }),
  updatedBy: text('updatedBy').references(() => users.id),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
});

export const warnings = pgTable('warnings', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  post_id: text('post_id')
    .notNull()
    .references(() => posts.id, {
      onDelete: 'cascade',
    }),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
});
//a user can be a member of multiple organizations
export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  organization_id: text('organization_id').references(() => organization.id),
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const organization = pgTable('organization', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  //OTP: a mix of numbers and letters of length 5
  otp: text('otp')
    .notNull()
    .$defaultFn(() => cre().toUpperCase()),
});

export enum Role {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export const userOrganizations = pgTable('user_organizations', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  user_id: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organization.id, {
      onDelete: 'cascade',
    }),
  role: text('role').$type<Role>().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  organizations: many(userOrganizations),
}));

export const userOrganizationsRelations = relations(
  userOrganizations,
  ({ one }) => ({
    user: one(users, {
      fields: [userOrganizations.user_id],
      references: [users.id],
    }),
    organization: one(organization, {
      fields: [userOrganizations.organization_id],
      references: [organization.id],
    }),
  }),
);

export const organizationRelations = relations(organization, ({ many }) => ({
  posts: many(posts),
  users: many(userOrganizations),
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
  warnings: many(warnings),
  organization: one(organization, {
    fields: [posts.organization_id],
    references: [organization.id],
  }),
  author: one(users, {
    fields: [posts.user_id],
    references: [users.id],
  }),
}));

export const warningsRelations = relations(warnings, ({ one }) => ({
  post: one(posts, {
    fields: [warnings.post_id],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [warnings.user_id],
    references: [users.id],
  }),
}));

enum status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export const organizationInvites = pgTable('organization_invites', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  email: text('email').notNull(),
  organization_id: text('organization_id')
    .notNull()
    .references(() => organization.id, {
      onDelete: 'cascade',
    }),
  status: text('status').$type<status>().notNull().default(status.PENDING),
});
