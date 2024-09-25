'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';

import { HookActionStatus } from '@/app/utils/get-org-status';

import PostContent from '../atoms/post-content';
import PostFooter from '../atoms/post-footer';
import PostHeader from '../atoms/post-header';
import CommentSection from './comment-section';

interface PostItemProps {
  post: any; // Replace 'any' with the actual post type
  onChangeStatus: (post_id: string, status: boolean) => void;
  onDeletePost: (params: { id: string }) => void;
  changePostStatus: HookActionStatus;
}

export default function PostItem({
  post,
  onChangeStatus,
  onDeletePost,
  changePostStatus,
}: PostItemProps) {
  const [commentInputVisible, setCommentInputVisible] = useState(false);

  return (
    <div>
      <motion.div
        layout
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        className="my-2 relative"
      >
        <div className="p-4 border-2 border-secondary rounded-md flex flex-col gap-4">
          <PostHeader
            author={post.author}
            onDelete={() => onDeletePost({ id: post.id })}
            onToggleComments={() =>
              setCommentInputVisible(!commentInputVisible)
            }
            commentsCount={post.comments?.length || 0}
          />
          <PostContent
            id={post.id}
            content={post.content}
            status={post.status}
            onChangeStatus={onChangeStatus}
            disabled={changePostStatus === HookActionStatus.EXECUTING}
          />
          <PostFooter
            updatedBy={post.updatedBy}
            updatedAt={post.updatedAt}
            status={post.status}
          />
        </div>
      </motion.div>
      {commentInputVisible && (
        <CommentSection postId={post.id} comments={post.comments} />
      )}
    </div>
  );
}
