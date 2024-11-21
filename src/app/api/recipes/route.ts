import { NextRequest, NextResponse } from 'next/server';
import { createSchema } from '@/utils/recipes/form.utils';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 403 });
  }

  try {
    const json = await request.json();
    const { title, type, ingredients, description, category, cover } =
      createSchema.parse(json);

    const response = await prisma.recipe.create({
      data: {
        title,
        type,
        description,
        category,
        author: {
          connect: {
            email: session.user.email,
          },
        },
        ingredients: {
          connect: ingredients.map((ingredient) => ({
            id: ingredient.id,
          })),
        },
        cover: cover
          ? {
              create: cover,
            }
          : undefined,
      },
    });

    revalidatePath('/admin');

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (e) {
    return NextResponse.json({ e }, { status: 400 });
  }
}
