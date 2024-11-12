'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import Link from 'next/link';

const RecipesList = async () => {
  const session = await auth();
  const recipes = await prisma.recipe.findMany({
    where: {
      authorId: session?.user?.id,
    },
  });

  return (
    <div className="grid grid-cols-6 my-4 gap-4">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <Link key={recipe.id} href={`/admin/recipes/${recipe.id}`}>
            <div className="border rounded-sm bg-primary/20 p-4 shadow hover:shadow-md transition">
              <h5>{recipe.title}</h5>
            </div>
          </Link>
        ))
      ) : (
        <h2>You have no recipes yet, start creating a new one !</h2>
      )}
    </div>
  );
};

export default RecipesList;
