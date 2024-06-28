import React from 'react';

import { Oswald } from 'next/font/google';

const lobster = Oswald({ subsets: ['latin'], weight: ['400'] });
export default function Logo() {
  return (
    <a className={`${lobster.className} text-3xl cursor-pointer`} href="/">
      <img
        src="/round.svg"
        alt="TaskCircle Logo"
        className="h-12 absolute left-12 top-8"
      />
      <li className="notranslate">task circle</li>
    </a>
  );
}
