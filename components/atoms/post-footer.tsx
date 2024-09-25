import { AnimatePresence, motion } from 'framer-motion';

import { getTimeAgo } from '@/lib/utils';

interface PostFooterProps {
  updatedBy: { name: string } | null;
  updatedAt: string;
  status: boolean;
}

export default function PostFooter({
  updatedBy,
  updatedAt,
  status,
}: PostFooterProps) {
  return (
    <div className="text-sm text-muted-foreground w-full flex justify-end -mt-3">
      <span className="text-muted-foreground text-xs flex gap-2 ease-in transition-all">
        <AnimatePresence presenceAffectsLayout>
          {updatedBy && status && (
            <motion.div
              className="text-muted-foreground text-xs flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-muted-foreground text-xs">
                Checked by <b>{updatedBy?.name}</b>
                {' • '}
                {getTimeAgo(new Date(updatedAt))}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
}
