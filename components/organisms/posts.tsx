'use client';

import { useCallback } from 'react';

import Image from 'next/image';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { GhostIcon, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { HookActionStatus } from '@/app/utils/get-org-status';
import CententralizedContent from '@/components/molecules/cententralized-content';
import { CardMotion } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useGetPosts } from '@/hooks/posts';
import { changePostStatus, deletePost } from '@/server/actions/posts';

export default function Posts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { organization } = useOrganizationStore();

  const {
    data: posts,
    error: postError,
    isLoading,
  } = useGetPosts(organization.id);

  const { execute: executeChangePostStatus, status } = useAction(
    changePostStatus,
    {
      onSettled() {
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        });
      },
    },
  );
  const { execute: executeDeletePost } = useAction(deletePost, {
    onSuccess() {
      toast({
        title: 'Task deleted.',
        description: 'Your task has been deleted successfully',
        variant: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });
  const { data: session } = useSession();

  const handleChangeStatus = useCallback(
    (post_id: string, status: boolean) => {
      executeChangePostStatus({ post_id, status, user_id: session?.user.id });
    },
    [executeChangePostStatus, session],
  );

  if (isLoading)
    return (
      <CardMotion
        layout
        className="flex flex-col mt-6 gap-6 border-none shadow-none"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-[96px] w-full rounded-xl" />
        ))}
      </CardMotion>
    );

  if (postError) return postError.message;

  if (posts?.success?.length === 0)
    return (
      <CententralizedContent>
        <h1 className="text-2xl font-bold text-center">No tasks found!</h1>
        <GhostIcon className="w-24 h-24 text-primary" />
      </CententralizedContent>
    );
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
                  <Trash
                    onClick={() => executeDeletePost({ id: post.id })}
                    className="w-4 text-red-400 cursor-pointer hover:text-red-700 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox
                  onClick={() => handleChangeStatus(post.id, !post.status)}
                  defaultChecked={post.status}
                  disabled={status === HookActionStatus.EXECUTING}
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
