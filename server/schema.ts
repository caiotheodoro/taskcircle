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
  updatedAt: timestamp('updatedAt').defaultNow(),
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
    .notNull()
    .primaryKey()
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

export const organizationRelations = relations(
  organization,
  ({ many, one }) => ({
    posts: many(posts),
    users: many(userOrganizations),
    invites: many(organizationInvites),
    settings: one(settings, {
      fields: [organization.id],
      references: [settings.organization_id],
    }),
  }),
);

export const postsRelations = relations(posts, ({ many, one }) => ({
  organization: one(organization, {
    fields: [posts.organization_id],
    references: [organization.id],
  }),
  author: one(users, {
    fields: [posts.user_id],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [posts.updatedBy],
    references: [users.id],
  }),
}));

export enum OrganizationInviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export const organizationInvites = pgTable('organization_invites', {
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
  status: text('status')
    .$type<OrganizationInviteStatus>()
    .notNull()
    .default(OrganizationInviteStatus.PENDING),
  expires_at: timestamp('expires_at').$defaultFn(
    () => new Date(Date.now() + 1000 * 60 * 60 * 24),
  ),
});

export const organizationInvitesRelations = relations(
  organizationInvites,
  ({ one }) => ({
    user: one(users, {
      fields: [organizationInvites.user_id],
      references: [users.id],
    }),
    organization: one(organization, {
      fields: [organizationInvites.organization_id],
      references: [organization.id],
    }),
  }),
);

export enum SettingsKey {
  DELETE_CHECKED_POSTS = 'delete_checked_posts',
}

export const settings = pgTable(
  'settings',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    key: text('key').$type<SettingsKey>().notNull(),
    value: text('value'),
    enabled: boolean('enabled').default(false),
    organization_id: text('organization_id').references(() => organization.id),
  },
  (settings) => ({
    compoundKey: primaryKey({
      columns: [settings.key, settings.organization_id],
    }),
  }),
);
