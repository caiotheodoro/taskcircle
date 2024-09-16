import React from 'react';

import { Oswald } from 'next/font/google';

import { cn } from '@/lib/utils';

import RoundedIcon from './rounded-icon';

const lobster = Oswald({ subsets: ['latin'], weight: ['400'] });
export default function Logo() {
  return (
    <a
      className={cn(lobster.className, 'text-3xl cursor-pointer relative')}
      href="/"
    >
      <RoundedIcon className="h-12 absolute -left-[63px] -top-1" />
      <li className="notranslate text-nowrap">task circle</li>
    </a>
  );
}
