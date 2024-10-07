import { auth } from '@/auth';
import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logout from '@/components/Logout';

const UserNav = async () => {
  const session = await auth();
  if (!session?.user) {
    return (
      <Link href="/login" className="flex items-center">
        <Image width={24} height={24} alt="logo" src="/account.svg" />
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-4 border-white border rounded-full">
          <Image width={24} height={24} alt="logo" src="/account.svg" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Logout />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserNav;
