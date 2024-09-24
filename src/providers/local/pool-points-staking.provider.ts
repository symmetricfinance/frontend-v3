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

/**
 * PoolStakingProvider
 *
 * Fetches data and provides functionality for a specific pool's gauge.
 */
export const poolStakingProvider = (_poolId?: string) => {
  /**
   * STATE
   */

  const poolId = ref(_poolId);
  const poolAddress = computed((): string | undefined =>
    poolId.value ? getAddressFromPoolId(poolId.value) : undefined
  );

  // const isPointsPool = computed((): boolean => {
  //   if (!poolId.value) return false;
  //   return POOLS.PointsGauges?.[poolId.value] !== undefined;
  // });

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

  const pointsGaugeAddress = computed((): string | undefined | null => {
    const gauges = configService.network.pools.PointsGauges;
    if (!gauges || !poolId.value) return null;
    return gauges[poolId.value] ? gauges[poolId.value] : null;
  });

  const isStakablePool = computed(
    (): boolean => !!poolId.value && pointsGaugeAddress.value !== null
  );

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
    return Promise.all([
      // refetchPoolGauges(),
      // refetchStakedShares(),
      // refetchUserGaugeShares(),
      // refetchUserBoosts(),
    ]);
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
    // stakedShares,
    isStakablePool,
    pointsGaugeAddress,
    setCurrentPool,
    refetchAllPoolStakingData,
    stakeForPoints,
    unstakeForPoints,
  };
};

/**
 * Provide setup: response type + symbol.
 */
export type PoolStakingProviderResponse = ReturnType<
  typeof poolStakingProvider
>;
export const PoolStakingProviderSymbol: InjectionKey<PoolStakingProviderResponse> =
  Symbol(symbolKeys.Providers.PoolStaking);

export function providePoolPointsStaking(poolId?: string) {
  provide(PoolStakingProviderSymbol, poolStakingProvider(poolId));
}

export function usePoolPointsStaking(): PoolStakingProviderResponse {
  return safeInject(PoolStakingProviderSymbol);
}
