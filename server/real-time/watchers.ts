'use client';

import { createClient } from './client';

type WatchChannelCallbackFn = (payload: any) => void;
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
