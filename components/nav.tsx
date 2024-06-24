import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';

import Logo from './atoms/logo';
import { Button } from './ui/button';
import { UserButton } from './user-button';

export default async function Nav() {
  const user = await auth();
  if (!user) redirect('/api/auth/signin');
  return (
    <nav>
      <ul className="flex py-8 justify-between items-center text-3xl relative">
        <Logo />
        <li>
          {!user ? (
            <Button asChild>
              <Link href={'/auth/login'}>Sign In</Link>
            </Button>
          ) : (
            <UserButton expires={user.expires} user={user.user} />
          )}
        </li>
      </ul>
    </nav>
  );
}
