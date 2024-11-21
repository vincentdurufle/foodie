import prisma from '@/lib/prisma';
import RecipeForm from '@/components/admin/recipes/form';
import notFound from '@/app/not-found';

type EditRecipePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditRecipePage = async ({ params }: EditRecipePageProps) => {
  const id = (await params).id;
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      ingredients: true,
      cover: true,
    },
  });

  if (!recipe) {
    return notFound();
  }

  return <RecipeForm recipe={recipe} />;
};

export default EditRecipePage;
