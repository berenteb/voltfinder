import { backendAxiosService } from '@/common/services/backend-axios.service';
import { SubscribeForUpdatesDto, SubscriptionListDto } from '@/common/types/types';

export async function getSubscriptionsForToken(token: string) {
  const response = await backendAxiosService.post<SubscriptionListDto>(`/subscriptions`, { token });
  return response.data;
}

export async function subscribeToUpdates(data: SubscribeForUpdatesDto) {
  await backendAxiosService.post('/subscribe', data);
}

export async function unsubscribeFromUpdates(data: SubscribeForUpdatesDto) {
  await backendAxiosService.post('/unsubscribe', data);
}
