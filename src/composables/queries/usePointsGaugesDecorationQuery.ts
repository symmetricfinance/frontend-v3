import { computed, reactive } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { gaugesDecorator } from '@/services/balancer/gauges/gauges.decorator';
import { PointsGauge } from '@/services/balancer/gauges/types';
import useWeb3 from '@/services/web3/useWeb3';

import useNetwork from '../useNetwork';
import { useTokens } from '@/providers/tokens.provider';
import { configService } from '@/services/config/config.service';

/**
 * TYPES
 */
type QueryResponse = PointsGauge[] | null;
type QueryOptions = UseQueryOptions<QueryResponse>;

/**
 * @summary Fetches onchain data for gauges list.
 */
export default function usePointsGaugesDecorationQuery(
  options: QueryOptions = {}
) {
  /**
   * COMPOSABLES
   */
  const { account, isWalletReady } = useWeb3();
  const { networkId } = useNetwork();
  const { injectTokens } = useTokens();

  /**
   * COMPUTED
   */
  const isQueryEnabled = computed(() => isWalletReady.value);

  const pointsGauges = computed(() => {
    if (!configService.network.pools.PointsGauges) return undefined;
    return Object.values(configService.network.pools.PointsGauges);
  });
  /**
   * QUERY KEY
   */
  const queryKey = reactive(
    QUERY_KEYS.Points.All.Onchain(pointsGauges, account, networkId)
  );

  /**
   * QUERY FUNCTION
   */
  const queryFn = async () => {
    // const _gauges = await gaugesDecorator.decorate(gauges.value, account.value);
    const _gauges = await gaugesDecorator.decoratePointsGauges(account.value);
    const tokens = _gauges.map(gauge => gauge.rewardTokens).flat();
    await injectTokens(tokens);
    return _gauges;
  };

  /**
   * QUERY OPTIONS
   */
  const queryOptions = reactive({
    enabled: isQueryEnabled,
    ...options,
  });

  return useQuery<QueryResponse>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
