import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { compareHashAndPassword } from '@/utils/auth';
import { AccessDenied } from '@auth/core/errors';

declare module 'next-auth' {
  interface Session {
    user: Pick<User, 'password' | 'email' | 'id'> & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: number;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 4 * 60 * 60, // 4 hours
  },
  providers: [
    Credentials({
      name: 'credentials',
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          type: 'email',
          label: 'Email',
        },
        password: {
          type: 'password',
          label: 'Password',
        },
      },
      // @ts-expect-error nextjs credential type bug
      authorize: async (
        credentials: Partial<Record<'email' | 'password', string>>
      ): Promise<User | null> => {
        let user: User | null = null;

        // logic to verify if the user exists
        user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new AccessDenied('Unauthorised', {
            status: 401,
          });
        }

        const isIdentical = await compareHashAndPassword(
          user.password,
          credentials.password ?? ''
        );

        if (!isIdentical) {
          throw new AccessDenied('Unauthorised', {
            status: 401,
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user && user.id) {
        token.id = parseInt(user.id);
      }
      return token;
    },
    session({ session, token }) {
      // @ts-expect-error type error from next auth
      session.user.id = token.id;

      return session;
    },
  },
});
