import Link from 'next/link';
import Image from 'next/image';

const Nav = () => {
  return (
    <div className="px-14 py-4 bg-primary grid text-white grid-cols-[auto_1fr_auto]">
      <Link href="/">
        <h1>FOODIE</h1>
      </Link>
      <div className="flex justify-center items-center uppercase">
        <span className="font-light text-xl">Bullshit</span>
      </div>
      <Link href="/login" className="flex items-center">
        <Image width={24} height={24} alt="logo" src="/account.svg" />
      </Link>
    </div>
  );
};

export default Nav;
