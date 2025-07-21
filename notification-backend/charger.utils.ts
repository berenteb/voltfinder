import { ChargePointViewModel, ChargerViewModel, ConnectorViewModel } from '@/common/types/charger-view-model.types';
import { PlugType } from '@/common/types/common.types';
import { MobilitiLocationDetails, MobilitiLocationItem } from '@/common/types/mobiliti.types';

export function mapMobilitiDataToChargerViewModel(
  listItem: MobilitiLocationItem,
  details: MobilitiLocationDetails | null
): ChargerViewModel {
  const chargePoints: ChargePointViewModel[] = listItem.evses.map((evse) => {
    const connectors: ConnectorViewModel[] = [
      {
        plugType: mapMobilitiPlugType(evse.plugType),
        power: evse.power / 1000,
        currentType: evse.currentType,
      },
    ];

    const chargePointDetails = details?.evses.find((evseDetails) => evseDetails.evseId === evse.evseId);

    return {
      id: chargePointDetails?.id ?? `${listItem.id}-${evse.plugType}-${evse.power / 1000}`,
      evseId: evse.evseId || evse.uid || `${listItem.id}-${evse.plugType}-${evse.power / 1000}`,
      status: chargePointDetails?.status ?? 'UNKNOWN',
      maxPowerKw: evse.power / 1000,
      plugTypes: [mapMobilitiPlugType(evse.plugType)],
      connectors: connectors,
    };
  });

  const maxPowerKw = Math.max(...chargePoints.map((cp) => cp.maxPowerKw), 0);
  const plugTypes = Array.from(new Set(chargePoints.flatMap((cp) => cp.plugTypes)));

  return {
    id: listItem.id,
    countryCode: 'HU',
    partyId: listItem.operator.name ?? '',
    locationId: listItem.id,
    fullAddress: listItem.address,
    name: listItem.name,
    coordinates: [Number(listItem.latitude), Number(listItem.longitude)],
    operatorName: listItem.operator.name ?? '',
    chargePoints: chargePoints,
    plugTypes: plugTypes,
    maxPowerKw: maxPowerKw,
    isFavorite: false,
    hasNotificationTurnedOn: false,
  };
}

function mapMobilitiPlugType(mobilitiPlugType: string): PlugType {
  const plugTypeMap: Record<string, PlugType> = {
    ccs: PlugType.Ccs,
    chademo: PlugType.CHAdeMO,
    type2: PlugType.Type2,
    'type 2': PlugType.Type2,
    type_2: PlugType.Type2,
  };

  return plugTypeMap[mobilitiPlugType.toLowerCase()] || PlugType.Type2;
}
