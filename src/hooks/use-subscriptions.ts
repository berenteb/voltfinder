import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { useFirebase } from '@/components/firebase-context';
import { getSubscriptionsForToken } from '@/services/notification.service';

export function useSubscription(stationId: string): UseQueryResult<boolean> {
  const { token } = useFirebase();
  return useQuery({
    queryKey: ['subscriptions', token],
    queryFn: () => {
      if (!token) {
        return [];
      }
      return getSubscriptionsForToken(token);
    },
    select: (data) => data?.includes(stationId) ?? false,
  });
}
