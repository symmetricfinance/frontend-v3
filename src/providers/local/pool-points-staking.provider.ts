import symbolKeys from '@/constants/symbol.keys';
import { getAddressFromPoolId } from '@/lib/utils';
import { computed, InjectionKey, provide } from 'vue';
import { LiquidityGauge } from '@/services/balancer/contracts/contracts/liquidity-gauge';
import { getAddress } from '@ethersproject/address';
import { parseUnits } from '@ethersproject/units';
import { useTokens } from '../tokens.provider';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import useWeb3 from '@/services/web3/useWeb3';
// import { POOLS } from '@/constants/pools';
import { safeInject } from '../inject';
import { configService } from '@/services/config/config.service';
import useStakedSharesQuery from '@/composables/queries/useStakedSharesQuery';
import { GaugeShare } from '@/composables/queries/useUserGaugeSharesQuery';

/**
 * PoolStakingProvider
 *
 * Fetches data and provides functionality for a specific pool's gauge.
 */
export const poolPointsStakingProvider = (_poolId?: string) => {
  /**
   * STATE
   */

  const poolId = ref(_poolId);
  const poolAddress = computed((): string | undefined =>
    poolId.value ? getAddressFromPoolId(poolId.value) : undefined
  );

  const pointsGaugeAddress = computed((): string | undefined | null => {
    const gauges = configService.network.pools.PointsGauges;
    if (!gauges || !poolId.value) return null;
    return gauges[poolId.value] ? gauges[poolId.value] : null;
  });

  const {
    data: _stakedShares,
    isRefetching: isRefetchingStakedShares,
    refetch: refetchStakedShares,
  } = useStakedSharesQuery(
    ref([
      {
        balance: '0',
        gauge: {
          id: pointsGaugeAddress.value,
          poolAddress: poolAddress.value,
          poolId: poolId.value,
          totalSupply: '0',
          isPreferentialGauge: true,
          isKilled: false,
        },
      },
    ] as GaugeShare[])
  );

  /**
   * COMPOSABLES
   */
  const { balanceFor } = useTokens();
  const { account, isWalletReady } = useWeb3();

  // // Fetches all gauges for specified pool (incl. preferential gauge).
  // const poolGaugesQuery = usePoolGaugesQuery(poolAddress);
  // const { data: poolGauges, refetch: refetchPoolGauges } = poolGaugesQuery;

  // // Access user data fetched on wallet connection/change.
  // const { userGaugeSharesQuery, userBoostsQuery, stakedSharesQuery } =
  //   useUserData();
  // const { data: userGaugeShares, refetch: refetchUserGaugeShares } =
  //   userGaugeSharesQuery;
  // const { data: boostsMap, refetch: refetchUserBoosts } = userBoostsQuery;
  // const {
  //   data: _stakedShares,
  //   refetch: refetchStakedShares,
  //   isRefetching: isRefetchingStakedShares,
  // } = stakedSharesQuery;

  /**
   * COMPUTED
   */
  // const isLoading = computed(
  //   (): boolean =>
  //     isQueryLoading(poolGaugesQuery) ||
  //     (isWalletReady.value &&
  //       (isQueryLoading(stakedSharesQuery) ||
  //         isQueryLoading(userGaugeSharesQuery) ||
  //         isQueryLoading(userBoostsQuery)))
  // );

  const isLoading = computed((): boolean => !isWalletReady.value);

  const isStakablePool = computed(
    (): boolean => !!poolId.value && pointsGaugeAddress.value !== null
  );

  // User's staked shares for pool (onchain data).
  const stakedShares = computed((): string => {
    if (!poolId.value) return '0';

    return _stakedShares?.value?.[poolId.value] || '0';
  });

  /**
   * METHODS
   */

  /**
   * Set current pool ID for this provider.
   *
   * @param {string} id - The pool ID to get staking data for.
   */
  function setCurrentPool(id: string) {
    poolId.value = id;
  }

  // Triggers refetch of all queries in this provider.
  async function refetchAllPoolStakingData() {
    return Promise.all([refetchStakedShares()]);
  }

  /**
   * stake
   *
   * Trigger stake transaction using the current user's full BPT balance for
   * this pool.
   */
  // async function stake(): Promise<TransactionResponse> {
  //   if (!poolAddress.value) throw new Error('No pool to stake.');
  //   if (!preferentialGaugeAddress.value) {
  //     throw new Error(
  //       `No preferential gauge found for this pool: ${poolId.value}`
  //     );
  //   }

  //   const gauge = new LiquidityGauge(preferentialGaugeAddress.value);
  //   // User's current full BPT balance for this pool.
  //   const userBptBalance = parseUnits(
  //     balanceFor(getAddress(poolAddress.value))
  //   );

  //   return await gauge.stake(userBptBalance);
  // }

  async function stakeForPoints(): Promise<TransactionResponse> {
    if (!poolAddress.value) throw new Error('No pool to stake.');
    if (!pointsGaugeAddress.value) {
      throw new Error(`No points gauge found for this pool: ${poolId.value}`);
    }

    const gauge = new LiquidityGauge(pointsGaugeAddress.value);
    // User's current full BPT balance for this pool.
    const userBptBalance = parseUnits(
      balanceFor(getAddress(poolAddress.value))
    );

    return await gauge.stake(userBptBalance);
  }

  /**
   * unstake
   *
   * Trigger unstake transaction using the first pool gauge that the user has a
   * balance in.
   */
  // async function unstake(): Promise<TransactionResponse> {
  //   if (!poolGauges.value?.pool?.gauges)
  //     throw new Error('Unable to unstake, no pool gauges');

  //   const gaugesWithUserBalance = await filterGaugesWhereUserHasBalance(
  //     poolGauges.value,
  //     account.value
  //   );
  //   const firstGaugeWithUserBalance = gaugesWithUserBalance[0];
  //   const gauge = new LiquidityGauge(firstGaugeWithUserBalance.id);
  //   const balance = await gauge.balance(account.value);
  //   return await gauge.unstake(balance);
  // }

  async function unstakeForPoints(): Promise<TransactionResponse> {
    if (!pointsGaugeAddress.value) {
      throw new Error(`No points gauge found for this pool: ${poolId.value}`);
    }
    const gauge = new LiquidityGauge(pointsGaugeAddress.value);
    const balance = await gauge.balance(account.value);
    return await gauge.unstake(balance);
  }

  return {
    isLoading,
    stakedShares,
    isStakablePool,
    pointsGaugeAddress,
    setCurrentPool,
    isRefetchingStakedShares,
    refetchStakedShares,
    refetchAllPoolStakingData,
    stakeForPoints,
    unstakeForPoints,
  };
};

/**
 * Provide setup: response type + symbol.
 */
export type PoolPointsStakingProviderResponse = ReturnType<
  typeof poolPointsStakingProvider
>;
export const PoolPointsStakingProviderSymbol: InjectionKey<PoolPointsStakingProviderResponse> =
  Symbol(symbolKeys.Providers.PoolPointsStaking);

export function providePoolPointsStaking(poolId?: string) {
  provide(PoolPointsStakingProviderSymbol, poolPointsStakingProvider(poolId));
}

export function usePoolPointsStaking(): PoolPointsStakingProviderResponse {
  return safeInject(PoolPointsStakingProviderSymbol);
}
