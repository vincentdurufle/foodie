import Image from 'next/image';

export default function Home() {
  return (
    <div className="h-[60vh] relative flex justify-center w-full">
      <Image
        className="object-cover"
        alt="table with foods"
        fill={true}
        src="/hero.jpg"
      />
      <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-black/60 uppercase text-white">
        Spice up your life !
      </h2>
    </div>
  );
}
