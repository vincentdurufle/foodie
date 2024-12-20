import Link from 'next/link';
import UserNav from '@/components/nav/UserNav';

const Nav = () => {
  return (
    <div className="px-14 py-4 bg-primary grid text-white grid-cols-[auto_1fr_auto]">
      <Link href="/">
        <h1>FOODIE</h1>
      </Link>
      <div className="flex justify-center items-center uppercase">
        <span className="font-light text-xl">Bullshit</span>
      </div>
      <UserNav />
    </div>
  );
};

export default Nav;
