'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useAction } from 'next-safe-action/hooks';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { HookActionStatus } from '@/app/utils/get-org-status';
import { useToast } from '@/components/ui/use-toast';
import { createComment, deleteComment } from '@/server/actions/messages';

import CommentItem from '../atoms/comment-item';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface CommentSectionProps {
  postId: string;
  comments: any[]; // Replace 'any' with the actual comment type
}

export default function CommentSection({
  postId,
  comments,
}: CommentSectionProps) {
  const [commentContent, setCommentContent] = useState('');
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { organization } = useOrganizationStore();

  const { execute: executeCreateComment, status: createCommentStatus } =
    useAction(createComment, {
      onSuccess() {
        toast({
          title: 'Comment added.',
          description: 'The comment has been added successfully',
          variant: 'success',
        });

        queryClient.invalidateQueries({
          queryKey: ['posts', organization.id],
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
        queryKey: ['posts', organization.id],
      });
    },
  });

  const handleCommentSubmit = () => {
    if (!session?.user?.id) return;
    executeCreateComment({
      content: commentContent,
      post_id: postId,
      user_id: session.user.id,
    });
    setCommentContent('');
  };

  return (
    <div className="flex flex-col gap-2 border-2 border-secondary rounded-xl p-2 border-t-0 rounded-t-none -mt-2 w-[95%] ml-4 bg-secondary/30">
      <AnimatePresence presenceAffectsLayout>
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={() => executeDeleteComment({ id: comment.id })}
          />
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="rounded-xl p-2 bg-secondary rounded-t-none -mt-2"
      >
        <div className="flex gap-2">
          <Input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow rounded-xl rounded-r-none"
          />
          <Button
            disabled={createCommentStatus === HookActionStatus.EXECUTING}
            onClick={handleCommentSubmit}
          >
            Submit
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
