import { useMemo } from 'react';

import { ChargerViewModel } from '@/common/types/charger-view-model.types';
import { useChargePointDetails } from '@/hooks/use-charge-point-details';
import { useChargePoints } from '@/hooks/use-charge-points';

export function useChargers() {
  const chargePoints = useChargePoints();
  const chargePointDetails = useChargePointDetails();

  const chargers: ChargerViewModel[] = useMemo<ChargerViewModel[]>(() => {
    const chargePointsData = chargePoints.data ?? [];
    const chargePointDetailsData = chargePointDetails.data ?? [];

    return chargePointsData.map<ChargerViewModel>((charger) => {
      return {
        ...charger,
        chargePoints: charger.chargePoints.map((cp) => ({
          ...cp,
          status: chargePointDetailsData.find((cpd) => cpd.dcsChargePointId === cp.id)?.OperationalStateCP ?? 'UNKNOWN',
        })),
      };
    });
  }, [chargePoints.data, chargePointDetails.data]);

  return {
    chargers,
    chargePointsQuery: chargePoints,
    chargePointDetailsQuery: chargePointDetails,
  };
}
