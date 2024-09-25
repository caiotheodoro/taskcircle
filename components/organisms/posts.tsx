'use client';

import { useCallback, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { GhostIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { HookActionStatus } from '@/app/utils/get-org-status';
import CententralizedContent from '@/components/molecules/cententralized-content';
import { CardMotion } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useGetPosts } from '@/hooks/posts';
import { changePostStatus, deletePost } from '@/server/actions/posts';
import { createClient } from '@/server/real-time/client';
import { listenToComments, listenToPosts } from '@/server/real-time/watchers';

import PostItem from '../molecules/post-item';

export default function Posts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { organization } = useOrganizationStore();
  const { data: session } = useSession();

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
        description: 'The task has been deleted successfully',
        variant: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });

  const handleChangeStatus = useCallback(
    (post_id: string, status: boolean) => {
      executeChangePostStatus({ post_id, status, user_id: session?.user.id });
    },
    [executeChangePostStatus, session],
  );

  useEffect(() => {
    const supabase = createClient();
    const channel = listenToPosts(supabase, organization.id, () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    });

    const channelComments = listenToComments(supabase, organization.id, () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    });

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(channelComments);
    };
  }, [organization.id, queryClient]);

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
      <div className="flex flex-col gap-4">
        <CardMotion
          layout
          className="flex flex-col mt-6 font-medium border-none shadow-none"
        >
          <AnimatePresence presenceAffectsLayout>
            {posts.success.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onChangeStatus={handleChangeStatus}
                onDeletePost={executeDeletePost}
                changePostStatus={status as HookActionStatus}
              />
            ))}
          </AnimatePresence>
        </CardMotion>
      </div>
    );
}
