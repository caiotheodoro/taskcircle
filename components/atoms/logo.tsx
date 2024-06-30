import React from 'react';

import { Oswald } from 'next/font/google';
import Image from 'next/image';

const lobster = Oswald({ subsets: ['latin'], weight: ['400'] });
export default function Logo() {
  return (
    <a className={`${lobster.className} text-3xl cursor-pointer`} href="/">
      <Image
        width={89}
        height={48}
        src="/round.svg"
        alt="TaskCircle Logo"
        className="h-12 absolute left-12 top-8"
      />
      <li className="notranslate">task circle</li>
    </a>
  );
}
