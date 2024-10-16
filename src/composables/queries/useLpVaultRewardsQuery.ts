import { computed, reactive } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { FeeDistributor } from '@/services/balancer/contracts/contracts/fee-distributor';
import { configService } from '@/services/config/config.service';
import { BalanceMap } from '@/services/token/concerns/balances.concern';
import useWeb3 from '@/services/web3/useWeb3';

import { networkId } from '../useNetwork';

/**
 * TYPES
 */
export type ProtocolRewardsQueryResponse = {
  v1?: BalanceMap;
  v2?: BalanceMap;
};

type QueryOptions = UseQueryOptions<ProtocolRewardsQueryResponse>;

/**
 * SERVICES
 */
// const feeDistributorV1 = new FeeDistributor(
//   configService.network.addresses.feeDistributorDeprecated
// );

const rewardDistributor = configService.network.addresses.rewardDistributor
  ? new FeeDistributor(configService.network.addresses.rewardDistributor)
  : undefined;

export const networkHasProtocolRewards = computed<boolean>(
  () => configService.network.addresses.rewardDistributor != ''
);

/**
 * @summary Fetches claimable protocol reward balances.
 */
export default function useProtocolRewardsQuery(options: QueryOptions = {}) {
  /**
   * COMPOSABLES
   */
  const { account, isWalletReady } = useWeb3();

  /**
   * COMPUTED
   */
  const enabled = computed(
    () =>
      isWalletReady.value &&
      account.value != null &&
      networkHasProtocolRewards.value
  );

  /**
   * QUERY KEY
   */
  const queryKey = reactive(QUERY_KEYS.Claims.Protocol(networkId, account));

  /**
   * QUERY FUNCTION
   */
  const queryFn = async () => {
    try {
      const [v2] = await Promise.all([
        rewardDistributor?.getClaimableBalances(account.value) ??
          Promise.resolve({}),
      ]);
      return { v2 };
    } catch (error) {
      console.error('Failed to fetch claimable protocol balances', error);
      return {};
    }
  };

  /**
   * QUERY OPTIONS
   */
  const queryOptions = reactive({
    enabled,
    ...options,
  });

  return useQuery<ProtocolRewardsQueryResponse>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
