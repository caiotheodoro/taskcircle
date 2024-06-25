import React from 'react';

import { Oswald } from 'next/font/google';

const lobster = Oswald({ subsets: ['latin'], weight: ['400'] });
export default function Logo() {
  return (
    <div className={`${lobster.className} text-3xl`}>
      <img
        src="/round.svg"
        alt="TaskCircle Logo"
        className="h-12 absolute left-12 top-8"
      />
      <li className="notranslate">task circle</li>
    </div>
  );
}
