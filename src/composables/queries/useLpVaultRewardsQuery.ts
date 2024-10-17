import { computed, reactive } from 'vue';
import { QueryFunction, useQuery, UseQueryOptions } from '@tanstack/vue-query';
import { BigNumber } from '@ethersproject/bignumber';

import QUERY_KEYS from '@/constants/queryKeys';
import { FeeDistributor } from '@/services/balancer/contracts/contracts/fee-distributor';
import { configService } from '@/services/config/config.service';
import { BalanceMap } from '@/services/token/concerns/balances.concern';
import useWeb3 from '@/services/web3/useWeb3';

import { networkId } from '../useNetwork';

/**
 * TYPES
 */
export type LpVaultRewardsQueryResponse = {
  v1?: BalanceMap;
  v2?: BalanceMap;
  userBalance?: BigNumber;
  tokensDistributedInWeek?: BigNumber;
  totalSupply?: BigNumber;
};

type QueryOptions = UseQueryOptions<LpVaultRewardsQueryResponse>;

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
      // Function to get last Thursday midnight UTC
      const getLastThursdayMidnight = () => {
        const now = new Date();
        const lastThursday = new Date(
          now.setDate(now.getDate() - ((now.getDay() + 3) % 7))
        );
        lastThursday.setUTCHours(0, 0, 0, 0);
        return Math.floor(lastThursday.getTime() / 1000); // Convert to unix timestamp
      };

      const lastThursdayTimestamp = getLastThursdayMidnight();
      console.log('lastThursdayTimestamp', lastThursdayTimestamp);

      const pointsAddress = configService.network.tokens.Addresses.POINTS;

      const [v2, userBalance, tokensDistributedInWeek, totalSupply] =
        await Promise.all([
          rewardDistributor?.getClaimableBalances(account.value) ??
            Promise.resolve({}),
          rewardDistributor?.getUserBalance(
            account.value,
            lastThursdayTimestamp
          ) ?? Promise.resolve(BigNumber.from(0)),
          rewardDistributor?.getTokensDistributedInWeek(
            pointsAddress as string,
            lastThursdayTimestamp
          ) ?? Promise.resolve(BigNumber.from(0)),
          rewardDistributor?.getTotalSupply(lastThursdayTimestamp) ??
            Promise.resolve(BigNumber.from(0)),
        ]);
      console.log('v2', v2);
      console.log('userBalance', userBalance.toString());
      console.log(
        'tokensDistributedInWeek',
        tokensDistributedInWeek.toString()
      );
      console.log('totalSupply', totalSupply.toString());
      return {
        v2,
        userBalance: userBalance,
        tokensDistributedInWeek: tokensDistributedInWeek,
        totalSupply: totalSupply,
      };
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

  return useQuery<LpVaultRewardsQueryResponse>(
    queryKey,
    queryFn as QueryFunction<LpVaultRewardsQueryResponse>,
    queryOptions as QueryOptions
  );
}
