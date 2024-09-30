import { computed, reactive } from 'vue';

import { PointsGauge } from '@/services/balancer/gauges/types';
import { PoolToken } from '@/services/pool/types';

import useGraphQuery from './queries/useGraphQuery';
import { isQueryLoading } from './queries/useQueryHelpers';
import { subgraphFallbackService } from '@/services/balancer/subgraph/subgraph-fallback.service';
import { PoolType } from '@symmetric-v3/sdk';
import QUERY_KEYS from '@/constants/queryKeys';
import usePointsGaugesDecorationQuery from './queries/usePointsGaugesDecorationQuery';

export type GaugePool = {
  id: string;
  address: string;
  poolType: PoolType;
  tokens: PoolToken[];
  tokensList: string[];
};

type GaugePoolQueryResponse = {
  pools: GaugePool[];
};

/**
 * @summary Combines queries for fetching claims page gauges and associated pools.
 */
export function usePointsClaimsData() {
  // Decorate subgraph gauges with current account's claim data, e.g. reward values
  const gaugesQuery = usePointsGaugesDecorationQuery();
  const gauges = computed((): PointsGauge[] => gaugesQuery.data.value || []);
  const gaugePoolIds = computed((): string[] => {
    return gauges.value.map(gauge => gauge.poolId).filter(id => !!id);
  });

  // Fetch pools associated with gauges
  const gaugePoolQueryEnabled = computed(
    (): boolean => gaugePoolIds?.value && gaugePoolIds.value?.length > 0
  );
  const gaugePoolQuery = useGraphQuery<GaugePoolQueryResponse>(
    subgraphFallbackService.url.value,
    QUERY_KEYS.Claims.GaugePools(gaugePoolIds),
    () => ({
      pools: {
        __args: {
          where: { id_in: gaugePoolIds.value },
          first: 1000,
        },
        id: true,
        address: true,
        poolType: true,
        tokensList: true,
        tokens: {
          address: true,
          weight: true,
        },
      },
    }),
    reactive({ enabled: gaugePoolQueryEnabled })
  );

  /**
   * COMPUTED
   */
  const gaugePools = computed(
    (): GaugePool[] => gaugePoolQuery.data.value?.pools || []
  );

  const isLoading = computed(
    (): boolean =>
      gaugePools.value.length === 0 || isQueryLoading(gaugePoolQuery)
  );

  return {
    gauges,
    gaugePools,
    //networkHasProtocolRewards,
    // protocolRewards,
    isLoading,
  };
}
