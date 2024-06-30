/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Y5q07mdAvEB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Globe } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Avatar, AvatarFallback } from '../ui/avatar';

export default function WelcomePage() {
  const { push: redirect } = useRouter();
  const [groupName, setGroupName] = useState('');

  const handleClick = () => {
    redirect(`/${groupName}`);
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Collaborate on tasks with your group
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Organize your group's tasks and projects in one place.
                    Create groups, assign tasks, and track progress together!
                  </p>
                </div>
                <div className="flex gap-2 max-w-96">
                  <Input
                    type="text"
                    placeholder="Group name"
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Button
                    variant="default"
                    className="w-40"
                    onClick={handleClick}
                  >
                    Create/Enter a Group
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-6 items-center mt-10">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-80">
                  <div className="p-4 flex items-center gap-4">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-green-300">
                        AC
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">Take out the trash</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow md:ml-44 min-w-80  -ml-14">
                  <div className="p-4 flex items-center gap-4">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback>DA</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold line-through">
                        Do the laundry
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-80">
                  <div className="p-4 flex items-center gap-4">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-pink-400">
                        BE
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">Buy groceries</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
