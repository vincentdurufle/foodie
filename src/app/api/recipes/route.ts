import { NextRequest, NextResponse } from 'next/server';
import { createSchema } from '@/utils/recipes/form.utils';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    console.log(session);
    return NextResponse.json({ error: 'User not found' }, { status: 403 });
  }

  try {
    const json = await request.json();
    const { title, type, ingredients, description, category } =
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
      },
    });

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ e }, { status: 400 });
  }
}
