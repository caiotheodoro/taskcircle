'use client';

import { useCallback, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { GhostIcon, MessageSquare, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { HookActionStatus } from '@/app/utils/get-org-status';
import CententralizedContent from '@/components/molecules/cententralized-content';
import { CardMotion } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useGetPosts } from '@/hooks/posts';
import { getInitials, getTimeAgo } from '@/lib/utils';
import {
  changePostStatus,
  createComment,
  deleteComment,
  deletePost,
} from '@/server/actions/posts';
import { createClient } from '@/server/real-time/client';
import { listenToComments, listenToPosts } from '@/server/real-time/watchers';

import FramerCheckbox from '../atoms/framer-checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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

  useEffect(() => {
    const supabase = createClient();
    const channel = listenToPosts(supabase, organization.id, (payload) => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization.id, queryClient]);

  useEffect(() => {
    const supabase = createClient();

    const channelComments = listenToComments(
      supabase,
      organization.id,
      (payload) => {
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        });
      },
    );

    return () => {
      supabase.removeChannel(channelComments);
    };
  }, [organization.id, queryClient]);

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
  const { data: session } = useSession();

  const handleChangeStatus = useCallback(
    (post_id: string, status: boolean) => {
      executeChangePostStatus({ post_id, status, user_id: session?.user.id });
    },
    [executeChangePostStatus, session],
  );

  const [commentInputVisible, setCommentInputVisible] = useState<string | null>(
    null,
  );
  const [commentContent, setCommentContent] = useState('');

  const { execute: executeCreateComment, status: createCommentStatus } =
    useAction(createComment, {
      onSuccess() {
        toast({
          title: 'Comment added.',
          description: 'The comment has been added successfully',
          variant: 'success',
        });

        queryClient.invalidateQueries({
          queryKey: ['posts'],
        });
      },
    });

  const { execute: executeDeleteComment } = useAction(deleteComment, {
    onSuccess() {
      toast({
        title: 'Comment deleted.',
        description: 'The comment has been deleted successfully',
        variant: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });

  const handleCommentSubmit = (postId: string) => {
    if (!session?.user?.id) return;
    executeCreateComment({
      content: commentContent,
      post_id: postId,
      user_id: session.user.id,
    });
    setCommentContent('');
  };

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
            {posts?.success.map((post) => (
              <div key={post.id}>
                <motion.div
                  layout
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="my-2 relative "
                  key={post.id}
                >
                  <div className="p-4 border-2 border-secondary rounded-md flex flex-col gap-4">
                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={post.author?.image || ''} />
                          <AvatarFallback className="text-xs font-bold">
                            {getInitials(post.author?.name || '')}
                          </AvatarFallback>
                        </Avatar>
                        <h2 className="text-sm font-normal">
                          {post.author.name}
                        </h2>
                      </div>
                      <div className="flex gap-3 items-center">
                        <Trash
                          onClick={() => executeDeletePost({ id: post.id })}
                          className="w-4 text-red-400 cursor-pointer hover:text-red-700 transition-colors"
                        />
                        <MessageSquare
                          onClick={() =>
                            setCommentInputVisible((prev) =>
                              prev === post.id ? null : post.id,
                            )
                          }
                          className="w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                        />
                        <span className="text-xs text-muted-foreground flex gap-2 items-center">
                          {post.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center ">
                      <FramerCheckbox
                        id={post.id}
                        checked={post.status}
                        onClick={() =>
                          handleChangeStatus(post.id, !post.status)
                        }
                        disabled={status === HookActionStatus.EXECUTING}
                      >
                        <FramerCheckbox.Indicator />
                        <FramerCheckbox.Label>
                          {post.content}
                        </FramerCheckbox.Label>
                      </FramerCheckbox>
                    </div>
                    <div className="text-sm text-muted-foreground w-full flex justify-end -mt-3">
                      <span className="text-muted-foreground text-xs flex gap-2 ease-in transition-all">
                        <AnimatePresence presenceAffectsLayout>
                          {post.updatedBy && post.status && (
                            <motion.div
                              className="text-muted-foreground text-xs flex gap-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <p className="text-muted-foreground text-xs">
                                Checked by <b>{post.updatedBy?.name}</b>
                                {' • '}
                                {getTimeAgo(new Date(post.updatedAt))}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </span>
                    </div>
                  </div>
                </motion.div>
                <AnimatePresence presenceAffectsLayout>
                  {commentInputVisible === post.id && (
                    <div className="flex flex-col gap-2 border-2 border-secondary rounded-xl p-2 border-t-0 rounded-t-none -mt-2  w-[95%]  ml-4 bg-secondary/30">
                      {post?.comments?.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="border-b-2 border-secondary"
                        >
                          <div className="flex gap-2 p-2 items-center justify-between">
                            <div className="flex gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={comment.author?.image || ''}
                                />
                                <AvatarFallback className="text-xs font-bold bg-white p-2">
                                  {getInitials(comment.author?.name || '')}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm text-muted-foreground">
                                @{comment.author?.name}{' '}
                                <span className="text-blue-500">said:</span>
                              </p>
                              <p className="text-sm ">{comment.content}</p>
                            </div>
                            <div className="flex gap-2 items-center text-muted-foreground text-xs">
                              <p className=" text-muted-foreground">
                                {getTimeAgo(new Date(comment.created_at))}
                              </p>
                              <Trash
                                onClick={() =>
                                  executeDeleteComment({ id: comment.id })
                                }
                                className="w-4 text-red-400 cursor-pointer hover:text-red-700 transition-colors"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {commentInputVisible === post.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className=" rounded-xl p-2 bg-secondary rounded-t-none -mt-2"
                        >
                          <div className="flex gap-2">
                            <Input
                              value={commentContent}
                              onChange={(e) =>
                                setCommentContent(e.target.value)
                              }
                              placeholder="Write a comment..."
                              className="flex-grow rounded-xl rounded-r-none"
                            />
                            <Button
                              disabled={
                                createCommentStatus ===
                                HookActionStatus.EXECUTING
                              }
                              onClick={() => handleCommentSubmit(post.id)}
                            >
                              Submit
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </AnimatePresence>
        </CardMotion>
      </div>
    );
}
