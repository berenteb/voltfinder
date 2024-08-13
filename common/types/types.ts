export type SubscribeForUpdatesDto = {
  stationId: string;
  token: string;
};

export type SubscriptionListDto = string[];

export type ChargerNotificationObject = {
  token: string;
  stationId: string;
  notificationData: {
    stationName: string;
    chargePointName: string;
    status: string;
  };
};
