import { useEffect, useState } from 'react';

import { motion, useAnimation } from 'framer-motion';
import { MessageSquare, Trash } from 'lucide-react';

import { getInitials } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface PostHeaderProps {
  author: { name: string; image: string };
  onDelete: () => void;
  onToggleComments: () => void;
  commentsCount: number;
}

export default function PostHeader({
  author,
  onDelete,
  onToggleComments,
  commentsCount,
}: PostHeaderProps) {
  const [prevCommentsCount, setPrevCommentsCount] = useState(commentsCount);
  const controls = useAnimation();

  useEffect(() => {
    if (commentsCount !== prevCommentsCount) {
      controls
        .start({
          color: '#3b82f6',
          transition: { duration: 0.3 },
        })
        .then(() => {
          controls.start({
            color: '#94a3b8',
            transition: { duration: 0.3, delay: 2.7 },
          });
        });
      setPrevCommentsCount(commentsCount);
    }
  }, [commentsCount, prevCommentsCount, controls]);

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Avatar className="w-6 h-6">
          <AvatarImage src={author?.image || ''} />
          <AvatarFallback className="text-xs font-bold">
            {getInitials(author?.name || '')}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-sm font-normal">{author.name}</h2>
      </div>
      <div className="flex gap-3 items-center">
        <Trash
          onClick={onDelete}
          className="w-4 text-red-400 cursor-pointer hover:text-red-700 transition-colors"
        />
        <motion.div
          animate={controls}
          className="flex items-center gap-1 cursor-pointer"
          onClick={onToggleComments}
        >
          <MessageSquare className="w-4 stroke-1" />
          <motion.span className="text-xs">{commentsCount}</motion.span>
        </motion.div>
      </div>
    </div>
  );
}
