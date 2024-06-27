'use client';

import { useCallback } from 'react';

import Image from 'next/image';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';

import usePersistStore from '@/app/hooks/stores/persist';
import { CardMotion } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetPosts } from '@/hooks/get-posts';
import {
  addWarning,
  changePostStatus,
  deletePost,
} from '@/server/actions/posts';

export default function Posts() {
  const queryClient = useQueryClient();

  const { organization } = usePersistStore();

  const { data: posts, error: postError } = useGetPosts(organization);
  const { execute: executeAddWarning } = useAction(addWarning);
  const { execute: executeChangePostStatus } = useAction(changePostStatus, {
    onSettled(data) {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });
  const { execute: exectueDeletePost } = useAction(deletePost);
  const { data: session } = useSession();

  const handleAddWarning = useCallback(
    (post_id: string) => {
      executeAddWarning({ post_id, user_id: session?.user.id });
    },
    [executeAddWarning, session],
  );

  const handleChangeStatus = useCallback(
    (post_id: string, status: boolean) => {
      executeChangePostStatus({ post_id, status, user_id: session?.user.id });
    },
    [executeChangePostStatus, session],
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
                    src={post.author.image}
                    width={24}
                    height={24}
                    className="rounded-full"
                    alt={post.author.name}
                  />
                  <h2 className="text-sm font-normal">{post.author.name}</h2>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <AlertTriangle
                      className="w-4 text-yellow-500"
                      onClick={() => handleAddWarning(post.id)}
                    />
                    <p className="text-sm text-yellow-500">
                      {post.warnings.length}
                    </p>
                  </div>
                  <Trash
                    onClick={() => exectueDeletePost({ id: post.id })}
                    className="w-4 text-red-400 cursor-pointer "
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox
                  onClick={() => handleChangeStatus(post.id, !post.status)}
                  defaultChecked={post.status}
                />
                <p
                  className={`text-primary text-sm ${post.status && 'line-through'}`}
                >
                  {post.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardMotion>
    );
}
