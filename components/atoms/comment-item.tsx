import { motion } from 'framer-motion';
import { Trash } from 'lucide-react';

import { getInitials, getTimeAgo } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    author: {
      name: string;
      image: string;
    };
  };
  onDelete: () => void;
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  return (
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
            <AvatarImage src={comment.author?.image || ''} />
            <AvatarFallback className="text-xs font-bold bg-white p-2">
              {getInitials(comment.author?.name || '')}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">
            @{comment.author?.name} <span className="text-blue-500">said:</span>
          </p>
          <p className="text-sm">{comment.content}</p>
        </div>
        <div className="flex gap-2 items-center text-muted-foreground text-xs">
          <p className="text-muted-foreground">
            {getTimeAgo(new Date(comment.created_at))}
          </p>
          <Trash
            onClick={onDelete}
            className="w-4 text-red-400 cursor-pointer hover:text-red-700 transition-colors"
          />
        </div>
      </div>
    </motion.div>
  );
}
