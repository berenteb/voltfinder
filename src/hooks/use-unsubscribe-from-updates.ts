import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useFirebase } from '@/components/firebase-context';
import { unsubscribeFromUpdates } from '@/services/notification.service';

export function useUnsubscribeFromUpdates() {
  const queryClient = useQueryClient();
  const { token } = useFirebase();
  return useMutation({
    mutationFn: async (stationId: string) => {
      if (!token) throw new Error('No token');
      return unsubscribeFromUpdates({ stationId, token });
    },
    onMutate: async (stationId: string) => {
      const previousSubscriptions = queryClient.getQueryData<string[]>(['subscriptions']);
      queryClient.setQueryData(
        ['subscriptions'],
        (previousSubscriptions ?? []).filter((id) => id !== stationId)
      );
      return previousSubscriptions;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] }),
    onError: (_, __, context) => {
      queryClient.setQueryData(['subscriptions'], context ?? []);
    },
  });
}
