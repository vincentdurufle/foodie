'use server';

import { object, string } from 'zod';
import prisma from '@/lib/prisma';
import { saltAndHashPassword } from '@/utils/auth';
import { signIn } from '@/auth';

const createAccount = async (prevState: unknown, formData: FormData) => {
  const schema = object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
    username: string({ required_error: 'Username is required' }).min(
      3,
      'Username must be more than 3 letters'
    ),
    password: string({ required_error: 'Password is required' })
      .min(3, 'Password must be more than 3 letters')
      .max(32, 'Password must be less than 32 letters'),
  });

  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  const alreadyExists = await prisma.user.findUnique({
    where: {
      email: formData.get('email') as string,
    },
  });

  if (alreadyExists) {
    return {
      message: { email: 'User already exists' },
    };
  }

  const password = await saltAndHashPassword(
    formData.get('password') as string
  );

  await prisma.user.create({
    data: {
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password,
    },
  });

  await signIn('credentials', {
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: true,
    redirectTo: '/',
  });
};

export { createAccount };
