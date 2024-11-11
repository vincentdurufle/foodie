import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const json: {
    body: { name?: string };
  } = await request.json();

  const name = json.body?.name;

  if (!name || name.length < 3) {
    return Response.json(
      {},
      {
        status: 400,
      }
    );
  }

  const alreadyExists = await prisma.ingredient.findFirst({
    where: {
      name,
    },
  });

  if (alreadyExists) {
    return Response.json(alreadyExists);
  }

  const created = await prisma.ingredient.create({
    data: {
      name,
    },
  });

  return Response.json(created, {
    status: 201,
  });
}
