'use client';

import React, { useState } from 'react';

import { signIn } from 'next-auth/react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import Logo from '../atoms/logo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function LoginScreen() {
  const [guestName, setGuestName] = useState('');

  const handleSocialLogin = (provider: string) => {
    signIn(provider.toLowerCase(), { callbackUrl: '/' });
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      await signIn('credentials', {
        name: guestName,
        //callbackUrl: '/',
      });
    }
  };

  const isGuestNameValid = guestName.trim().length >= 3;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 relative ">
          <ul className="flex py-8 justify-between items-center text-3xl  mx-auto">
            <Logo />
          </ul>
          <p className="text-sm text-muted-foreground text-center">
            Choose a login option to access your tasks
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleSocialLogin('Google')}
          >
            <FaGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleSocialLogin('GitHub')}
          >
            <FaGithub className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <form onSubmit={handleGuestLogin}>
            <div className="space-y-2">
              <Label htmlFor="guestName">Enter as Guest</Label>
              <Input
                id="guestName"
                type="text"
                placeholder="Your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2"
              variant="secondary"
              disabled={!isGuestNameValid}
            >
              Continue as Guest
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">
            Note: if you log out as a guest, you will not be able to login again
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
