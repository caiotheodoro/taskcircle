'use client';

import { useCallback, useEffect } from 'react';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { GhostIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';
import { useInView } from 'react-intersection-observer';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { HookActionStatus } from '@/app/utils/get-org-status';
import CententralizedContent from '@/components/molecules/cententralized-content';
import { CardMotion } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  changePostStatus,
  deletePost,
  fetchPosts,
} from '@/server/actions/posts';
import { createClient } from '@/server/real-time/client';
import { listenToComments, listenToPosts } from '@/server/real-time/watchers';

import PostItem from '../molecules/post-item';

const POSTS_PER_PAGE = 10;

export default function Posts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { organization } = useOrganizationStore();
  const { data: session } = useSession();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['posts', organization.id],
      initialPageParam: 0,
      queryFn: ({ pageParam = 0 }) =>
        fetchPosts(organization.id, pageParam, POSTS_PER_PAGE),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.success && lastPage.success.length === POSTS_PER_PAGE) {
          return allPages.length;
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const { execute: executeChangePostStatus, status: changeStatusStatus } =
    useAction(changePostStatus, {
      onSettled() {
        queryClient.invalidateQueries({
          queryKey: ['posts', organization.id],
        });
      },
    });

  const { execute: executeDeletePost } = useAction(deletePost, {
    onSuccess(data) {
      if (data.success) {
        toast({
          title: 'Task deleted.',
          description: 'The task has been deleted successfully',
          variant: 'success',
        });
        queryClient.invalidateQueries({
          queryKey: ['posts', organization.id],
        });
      } else if (data.error) {
        toast({
          title: 'Error deleting task',
          description: `Failed to delete task: ${data.error}`,
          variant: 'destructive',
        });
      }
    },
    onError(error) {
      console.error('Delete post error:', error);
      toast({
        title: 'Error deleting task',
        description: 'An unexpected error occurred while deleting the task',
        variant: 'destructive',
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
        queryKey: ['posts', organization.id],
      });
    });

    const channelComments = listenToComments(supabase, organization.id, () => {
      queryClient.invalidateQueries({
        queryKey: ['posts', organization.id],
      });
    });

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(channelComments);
    };
  }, [organization.id, queryClient]);

  if (status === 'pending') {
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
  }

  if (status === 'error') return 'An error has occurred';

  if (data?.pages[0]?.success?.length === 0)
    return (
      <CententralizedContent>
        <h1 className="text-2xl font-bold text-center">No tasks found!</h1>
        <GhostIcon className="w-24 h-24 text-primary" />
      </CententralizedContent>
    );

  return (
    <div className="flex flex-col gap-4">
      <CardMotion
        layout
        className="flex flex-col mt-6 font-medium border-none shadow-none"
      >
        <AnimatePresence presenceAffectsLayout>
          {data?.pages.map((page, i) =>
            page.success?.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onChangeStatus={handleChangeStatus}
                onDeletePost={executeDeletePost}
                changePostStatus={changeStatusStatus as HookActionStatus}
              />
            )),
          )}
        </AnimatePresence>
      </CardMotion>
      {isFetchingNextPage && (
        <CardMotion
          layout
          className="flex flex-col mt-6 gap-6 border-none shadow-none"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[96px] w-full rounded-xl" />
          ))}
        </CardMotion>
      )}
      <div ref={ref} style={{ height: '20px' }} />
    </div>
  );
}
