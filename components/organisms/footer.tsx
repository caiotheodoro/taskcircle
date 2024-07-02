import React from 'react';

import Link from 'next/link';

import { Code, Globe } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-5 md:px-56 border-t fixed bottom-0 left-0 bg-background z-20">
      <p className="text-xs text-muted-foreground">
        &copy; 2024 Task circle. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          href="https://github.com/caiotheodoro"
          className="text-xs hover:underline underline-offset-4"
          prefetch={false}
          target="_blank"
        >
          <FaGithub className="w-5 h-5" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/caiotheodoro1/"
          className="text-xs hover:underline underline-offset-4"
          prefetch={false}
          target="_blank"
        >
          <FaLinkedin className="w-5 h-5" />
        </Link>
        <Link
          href="https://caiotheodoro.dev"
          className="text-xs hover:underline underline-offset-4"
          prefetch={false}
          target="_blank"
        >
          <Globe className="w-5 h-5" />
        </Link>
        <Link
          href={'/architecture'}
          className="text-xs hover:underline underline-offset-4"
          prefetch={false}
        >
          <Code className="w-5 h-5" />
        </Link>
      </nav>
    </footer>
  );
}
