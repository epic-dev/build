import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  const images = [
    {
      id: '1',
      title: '1',
      imageUrl: '/images/1.png'
    },
    {
      id: '2',
      title: '2',
      imageUrl: '/images/2.png'
    },
    {
      id: '3',
      title: '3',
      imageUrl: '/images/3.png'
    },
  ];
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        
        <div>
          <h1>Gallery</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {images.map(p => (
              <Link key={p.id} href={`/photos/${p.id}`}>
                <img src={p.imageUrl} alt={p.title} style={{ width: '100%' }} />
                <p>{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
