import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AdminPage = () => {
  return (
    <div className="p-14">
      <Link href="admin/recipes/create">
        <Button size="lg">Create new recipe</Button>
      </Link>
    </div>
  );
};

export default AdminPage;
