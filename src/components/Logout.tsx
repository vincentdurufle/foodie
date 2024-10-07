'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';

const Logout = () => {
  return (
    <DropdownMenuItem onSelect={() => signOut()}>Sign out</DropdownMenuItem>
  );
};

export default Logout;
