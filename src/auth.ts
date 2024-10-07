import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import { compareHashAndPassword } from '@/utils/auth';
import { AccessDenied } from '@auth/core/errors';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials): Promise<User> => {
        let user = null;

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
          credentials.password
        );

        if (!isIdentical) {
          throw new AccessDenied('Unauthorised', {
            status: 401,
          });
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
});
