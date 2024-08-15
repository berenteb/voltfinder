import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { useFirebase } from '@/components/firebase-context';
import { getSubscriptionsForToken } from '@/services/notification.service';

export function useSubscriptions(): UseQueryResult<string[]> {
  const { token } = useFirebase();
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => {
      if (!token) {
        return [];
      }
      return getSubscriptionsForToken(token);
    },
    enabled: Boolean(token),
    initialData: [],
  });
}
