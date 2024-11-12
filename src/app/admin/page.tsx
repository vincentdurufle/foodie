import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RecipesList from '@/components/admin/recipes/RecipesList';

const AdminPage = () => {
  return (
    <div className="p-14 w-full">
      <Link href="admin/recipes/new">
        <Button size="lg">Create new recipe</Button>
      </Link>
      <RecipesList />
    </div>
  );
};

export default AdminPage;
