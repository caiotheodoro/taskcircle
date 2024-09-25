import { DehydratedState } from '@tanstack/react-query';

export async function formatHydrationState<T>(state: DehydratedState) {
  return {
    data: state?.queries[0]?.state?.data,
    isFetching: state?.queries[0]?.state?.fetchStatus === 'fetching',
    status: state?.queries[0]?.state?.status,
    error: !!state?.queries[0]?.state?.error,
  } as T;
}
