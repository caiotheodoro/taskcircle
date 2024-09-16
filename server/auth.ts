import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { getGuestEmail } from '@/lib/utils';
import { db } from '@/server';

import { createGuestAccountAndUser } from './actions/account';

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Guest',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'Enter your name' },
      },
      async authorize(credentials) {
        if (!credentials?.name) return null;

        const email = getGuestEmail(credentials.name as string);

        let user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        });

        if (!user) {
          const response = await createGuestAccountAndUser(
            credentials.name as string,
            email,
          );

          if (response.error) return null;

          user = {
            id: response.userId,
            name: credentials.name as string,
            email,
            emailVerified: null,
            organization_id: null,
            image: null,
          };
        }

        return user;
      },
    }),
  ],
  adapter: DrizzleAdapter(db),
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        (session.expires as string) = new Date(
          Date.now() + 3 * 365 * 24 * 60 * 60 * 1000,
        ).toISOString();
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn } = NextAuth(authConfig);
