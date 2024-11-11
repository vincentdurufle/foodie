'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  return (
    <DropdownMenuItem onSelect={() => router.push('/admin')}>
      Dashboard
    </DropdownMenuItem>
  );
};

export default Dashboard;
