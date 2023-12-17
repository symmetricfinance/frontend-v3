import { computed, reactive } from 'vue';
import { useQuery, QueryObserverOptions } from '@tanstack/vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { poolsStoreService } from '@/services/pool/pools-store.service';
import { Pool } from '@/services/pool/types';

import useNetwork from '../useNetwork';
import usePoolQuery from './usePoolQuery';
import { AprBreakdown } from '@symmetric-v3/sdk';
import { getBalancerSDK } from '@/dependencies/balancer-sdk';
import { subgraphRequest } from '@/lib/utils/subgraph';

type QueryOptions = QueryObserverOptions<AprBreakdown>;

export default function usePoolAprQuery(
  id: string,
  options: QueryObserverOptions<AprBreakdown> = {}
) {
  /**
   * @description
   * If pool is already downloaded, we can use it instantly
   * it may be if user came to pool page from home page
   */
  const storedPool = poolsStoreService.findPool(id);

  /**
   * COMPOSABLES
   */
  const poolQuery = usePoolQuery(id);

  /**
   * QUERY DEPENDENCIES
   */
  const { networkId } = useNetwork();

  /**
   * COMPUTED
   */
  const pool = computed(() => poolQuery.data.value);
  const enabled = computed(() => !!pool.value?.id || !!storedPool);

  // const rewardAprs = async (
  //   pool: Pool
  // ): Promise<AprBreakdown['rewardAprs']> => {
  //   if (!this.liquidityGauges) {
  //     return { total: 0, breakdown: {} };
  //   }

  //   // Data resolving
  //   const gauge = await this.liquidityGauges.findBy('poolId', pool.id);
  //   if (
  //     !gauge ||
  //     !gauge.rewardTokens ||
  //     Object.keys(gauge.rewardTokens).length < 1
  //   ) {
  //     return { total: 0, breakdown: {} };
  //   }

  //   // BAL rewards already returned as stakingApr, so we can filter them out
  //   const bal =
  //     BALANCER_NETWORK_CONFIG[pool.chainId as Network].addresses.tokens.bal;
  //   const rewardTokenAddresses = Object.keys(gauge.rewardTokens).filter(
  //     a => a != bal
  //   );

  //   // Gets each tokens rate, extrapolate to a year and convert to USD
  //   const rewards = rewardTokenAddresses.map(async tAddress => {
  //     /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  //     const data = gauge!.rewardTokens![tAddress];
  //     return rewardTokenApr(tAddress, data);
  //   });
  //   // Get the gauge totalSupplyUsd
  //   const bptPriceUsd = await this.bptPrice(pool);
  //   const totalSupplyUsd = gauge.totalSupply * bptPriceUsd;

  //   if (totalSupplyUsd == 0) {
  //     return { total: 0, breakdown: {} };
  //   }

  //   const rewardTokensBreakdown: Record<string, number> = {};

  //   let total = 0;
  //   for await (const reward of Object.values(rewards)) {
  //     const rewardValue = reward.value / totalSupplyUsd;
  //     const rewardValueScaled = Math.round(10000 * rewardValue);
  //     total += rewardValueScaled;
  //     rewardTokensBreakdown[reward.address] = rewardValueScaled;
  //   }

  //   return {
  //     total,
  //     breakdown: rewardTokensBreakdown,
  //   };
  // };

  // const rewardTokenApr = async (
  //   tokenAddress: string,
  //   rewardData: { rate: BigNumber; period_finish: BigNumber; decimals?: number }
  // ) => {
  //   if (rewardData.period_finish.toNumber() < Date.now() / 1000) {
  //     return {
  //       address: tokenAddress,
  //       value: 0,
  //     };
  //   } else {
  //     const yearlyReward = rewardData.rate.mul(86400).mul(365);
  //     const price = await this.tokenPrices.find(tokenAddress);
  //     if (price && price.usd) {
  //       let decimals = 18;
  //       if (rewardData.decimals) {
  //         decimals = rewardData.decimals;
  //       } else {
  //         const meta = await this.tokenMeta.find(tokenAddress);
  //         decimals = meta?.decimals || 18;
  //       }
  //       const yearlyRewardUsd =
  //         parseFloat(formatUnits(yearlyReward, decimals)) *
  //         parseFloat(price.usd);
  //       return {
  //         address: tokenAddress,
  //         value: yearlyRewardUsd,
  //       };
  //     } else {
  //       console.error(`No USD price for ${tokenAddress}`);
  //     }
  //   }
  // };

  function roundDownTimestamp(timestamp: number): number {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const day = date.getUTCDay(); // Get the day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
    const daysToThursday = (day + 7 - 4) % 7; // Calculate the number of days to Thursday (4 - Thursday)
    date.setUTCDate(date.getUTCDate() - daysToThursday); // Subtract the number of days to Thursday
    date.setUTCHours(0, 0, 0, 0); // Set the time to midnight (00:00:00)
    return Math.floor(date.getTime() / 1000); // Convert back to Unix timestamp in seconds
  }

  const gaugeTotalSupply = async (poolAddress: string): Promise<bigint> => {
    try {
      const data = await subgraphRequest<{
        pool: { preferentialGauge: { totalSupply: bigint } };
      }>({
        url: useNetwork().networkConfig.subgraphs.gauge,
        query: {
          pool: {
            __args: {
              id: poolAddress.toLowerCase(),
            },
            preferentialGauge: {
              totalSupply: true,
            },
          },
        },
      });

      return data.pool.preferentialGauge.totalSupply;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * QUERY INPUTS
   */
  const queryKey = QUERY_KEYS.Pools.APR(networkId, id);

  const queryFn = async (): Promise<AprBreakdown> => {
    let _pool: Pool;
    if (storedPool) {
      _pool = storedPool;
    } else if (pool.value) {
      // copy computed pool to avoid mutation warnings
      _pool = { ...pool.value, tokens: [...pool.value.tokens] };
    } else {
      throw new Error('No pool');
    }

    if (_pool?.apr) {
      return _pool.apr;
    }

    _pool.chainId = networkId.value;

    const apr = await getBalancerSDK().pools.apr(_pool);
    // has local rewards
    const timestamp = roundDownTimestamp(Date.now() / 1000);
    const rewards = useNetwork().networkConfig.rewards;
    console.log(timestamp);
    if (rewards && rewards[timestamp] && rewards[timestamp][_pool.id]) {
      // Get gauge
      const totalSupply = await gaugeTotalSupply(_pool.address);
      console.log('totalSupply', totalSupply);
    }
    return apr;
  };
  const queryOptions = reactive({
    enabled,
    ...options,
  });
  return useQuery<AprBreakdown>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
