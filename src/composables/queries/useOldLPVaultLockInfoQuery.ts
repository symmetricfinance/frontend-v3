import { computed, reactive } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import { balancerContractsService } from '@/services/balancer/contracts/balancer-contracts.service';
import { VeBalLockInfo } from '@/services/balancer/contracts/contracts/lpVault';
import useWeb3 from '@/services/web3/useWeb3';

import useNetwork from '../useNetwork';

/**
 * TYPES
 */
type QueryResponse = VeBalLockInfo;
type QueryOptions = UseQueryOptions<QueryResponse>;

export default function useOldLpVaultQuery(options: QueryOptions = {}) {
  /**
   * COMPOSABLES
   */
  const { account, isWalletReady } = useWeb3();
  const { networkId } = useNetwork();
  /**
   * COMPUTED
   */
  const enabled = computed(() => isWalletReady.value);

  const queryFn = () => {
    const getLastThursdayMidnight = () => {
      const now = new Date();
      const lastThursday = new Date(
        now.setDate(now.getDate() - ((now.getDay() + 3) % 7))
      );
      lastThursday.setUTCHours(0, 0, 0, 0);
      return Math.floor(lastThursday.getTime() / 1000); // Convert to unix timestamp
    };

    const lastThursdayTimestamp = getLastThursdayMidnight();
    return balancerContractsService.lpVault.getOldLockInfo(
      account.value,
      lastThursdayTimestamp
    );
  };

  const queryOptions = reactive({
    enabled,
    ...options,
  });

  return useQuery<QueryResponse>(
    reactive(['tokens', 'oldLpVault', { networkId, account }]),
    queryFn,
    queryOptions as QueryOptions
  );
}
