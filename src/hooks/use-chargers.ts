import { useMemo } from 'react';

import { useChargePointDetails } from '@/hooks/use-charge-point-details';
import { useChargePoints } from '@/hooks/use-charge-points';
import { ChargerViewModel } from '@/types/charger-view-model.types';

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
