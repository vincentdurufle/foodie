import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createSchema } from '@/utils/recipes/form.utils';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const id = parseInt((await params).id);

  if (!session?.user) {
    return NextResponse.json({ error: 'User not found' }, { status: 403 });
  }

  try {
    const json = await request.json();
    const { title, type, ingredients, description, category, cover } =
      createSchema.parse(json);

    const response = await prisma.recipe.update({
      where: {
        id,
      },
      data: {
        title,
        type,
        description,
        category,
        ingredients: {
          set: ingredients.map((ingredient) => ({
            id: ingredient.id,
          })),
        },
        cover: cover
          ? {
              connectOrCreate: {
                where: {
                  filename: cover?.filename,
                },
                create: cover,
              },
            }
          : undefined,
      },
    });

    revalidatePath('/admin');
    revalidatePath(`/admin/recipes/${id}`);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (e) {
    return NextResponse.json({ e }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);

  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    return new Response(null, { status: 204 });
  }

  await prisma.recipe.delete({
    where: { id },
  });

  return new Response(null, { status: 204 });
}
