import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const response = await prisma.ingredient.findMany({
    orderBy: {
      name: 'asc',
    },
    where: {
      name: {
        contains: query ?? '',
        mode: 'insensitive',
      },
    },
    take: 10,
  });

  return Response.json(response ? response : []);
}
