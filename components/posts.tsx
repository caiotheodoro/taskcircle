'use client';

import { useCallback } from 'react';

import Image from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';
import { HeartIcon, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';

import { useGetPosts } from '@/data/get-posts';
import { cn } from '@/lib/utils';
import { addLike, deletePost } from '@/server/actions/create-post';

import {
  CardDescription,
  CardHeader,
  CardHeaderMotion,
  CardMotion,
  CardTitle,
} from './ui/card';
import { Checkbox } from './ui/checkbox';

export default function Posts() {
  const { data: posts, error: postError, fetchStatus } = useGetPosts();
  const { execute: executeAddLike } = useAction(addLike);
  const { execute: exectueDeletePost } = useAction(deletePost);
  const { data: session } = useSession();

  const handleAddLike = useCallback(
    (post_id: string) => {
      executeAddLike({ post_id, user_id: session?.user.id as string });
    },
    [executeAddLike, session],
  );
  if (postError) return postError.message;
  if (posts?.success)
    return (
      <CardMotion
        layout
        className="flex flex-col mt-6 font-medium border-none shadow-none"
      >
        <AnimatePresence presenceAffectsLayout>
          {posts?.success.map((post) => (
            <motion.div
              layout
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              className="my-2 p-4 border-2 border-secondary rounded-md flex flex-col gap-4"
              key={post.id}
            >
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <Image
                    src={post.author.image!}
                    width={24}
                    height={24}
                    className="rounded-full"
                    alt={post.author.name!}
                  />
                  <h2 className="text-sm font-normal">{post.author.name}</h2>
                </div>
                <Trash
                  onClick={() => exectueDeletePost({ id: post.id })}
                  className="w-4 text-red-400 cursor-pointer "
                />
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox />
                <p className="text-primary text-sm">{post.content}</p>
              </div>

              {/* <div onClick={() => handleAddLike(post.id)}
                  className="flex items-center gap-1 cursor-pointer">
                    
                  <HeartIcon className="w-4 text-secondary-foreground" /> */}
              {/* <p className="text-sm">{post.likes.length}</p> */}
              {/* </div> */}
            </motion.div>
          ))}
        </AnimatePresence>
      </CardMotion>
    );
}
