import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useFirebase } from '@/components/firebase-context';
import { subscribeToUpdates } from '@/services/notification.service';

export function useSubscribeToUpdates() {
  const queryClient = useQueryClient();
  const { getTokenWithGrant } = useFirebase();
  return useMutation({
    mutationFn: async (stationId: string) => {
      const localToken = await getTokenWithGrant();
      if (!localToken) throw new Error('No token');
      return subscribeToUpdates({ stationId, token: localToken });
    },
    onMutate: async (stationId: string) => {
      const previousSubscriptions = queryClient.getQueryData<string[]>(['subscriptions']);
      queryClient.setQueryData(['subscriptions'], [...(previousSubscriptions ?? []), stationId]);
      return previousSubscriptions;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] }),
    onError: (_, __, context) => {
      queryClient.setQueryData(['subscriptions'], context ?? []);
    },
  });
}
