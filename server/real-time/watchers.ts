'use client';

import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { createClient } from './client';

type WatchChannelCallbackFn = (payload: any) => void;

type Payload = RealtimePostgresChangesPayload<{
  new: {
    post_id: string;
  };
  old: {
    post_id: string;
  };
}> & {
  new: {
    post_id: string;
  };
  old: {
    post_id: string;
    id: string;
  };
};

export const listenToPosts = (
  supabase: ReturnType<typeof createClient>,
  org_id: string,
  callback: WatchChannelCallbackFn,
) => {
  return supabase
    .channel('posts')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `organization_id=eq.${org_id}`,
      },

      callback,
    )
    .subscribe();
};

export const listenToInvites = (
  supabase: ReturnType<typeof createClient>,
  org_id: string,
  callback: WatchChannelCallbackFn,
) => {
  return supabase
    .channel('organization_invites')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'organization_invites',
        filter: `organization_id=eq.${org_id}`,
      },

      callback,
    )
    .subscribe();
};

export const listenToComments = (
  supabase: ReturnType<typeof createClient>,
  org_id: string,
  callback: WatchChannelCallbackFn,
) => {
  return supabase
    .channel('comments')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
      },
      (payload: Payload) => {
        const postId: string = payload.new?.post_id || payload.old?.post_id;
        if (!postId) {
          return;
        }

        supabase
          .from('posts')
          .select('organization_id')
          .eq('id', postId)
          .single()
          .then(({ data, error }) => {
            if (!error && data && data.organization_id === org_id) {
              callback(payload);
            }
          });
      },
    )
    .subscribe();
};
