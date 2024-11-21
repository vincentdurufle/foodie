'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { getImgHippo } from '@/utils/images/image.utils';

const RecipesList = async () => {
  const session = await auth();
  const recipes = await prisma.recipe.findMany({
    where: {
      authorId: session?.user?.id,
    },
    include: {
      cover: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div className="grid grid-cols-4 my-4 gap-4">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <Card key={recipe.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>
                <h5>{recipe.title}</h5>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                className="h-full max-h-[250px] w-full object-cover"
                src={getImgHippo(recipe.cover?.filename)}
                alt=""
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link key={recipe.id} href={`/admin/recipes/${recipe.id}`}>
                <Button variant="link">Edit</Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <h2>You have no recipes yet, start creating a new one !</h2>
      )}
    </div>
  );
};

export default RecipesList;
