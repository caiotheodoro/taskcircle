import Link from 'next/link';
import { redirect } from 'next/navigation';

import Logo from '@/components/atoms/logo';
import OrgPanel from '@/components/atoms/user-panel';
import { UserButton } from '@/components/molecules/user-button';
import { Button } from '@/components/ui/button';
import { auth } from '@/server/auth';

export default async function Nav() {
  const user = await auth();

  if (!user) redirect('/api/auth/signin');
  return (
    <nav className="animate-in fade-in-25 duration-700">
      <ul className="flex py-8 justify-between items-center text-3xl relative">
        <Logo />
        <li>
          {!user ? (
            <Button asChild>
              <Link href={'/auth/login'}>Sign In</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <OrgPanel />
              <UserButton expires={user.expires} user={user.user} />
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
