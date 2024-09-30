<script lang="ts" setup>
import { computed, watch } from 'vue';

import PointsRewardsTable from '@/components/tables/PointsRewardsTable.vue';

import { GaugePool } from '@/composables/useClaimsData';
import { usePointsClaimsData } from '@/composables/usePointsClaimsData';
import { useTokens } from '@/providers/tokens.provider';

import { PointsGauge } from '@/services/balancer/gauges/types';
//import { configService } from '@/services/config/config.service';

import useWeb3 from '@/services/web3/useWeb3';
import { networkSlug } from '@/composables/useNetwork';
//import { bnum } from '@/lib/utils';
import BalCard from '@/components/_global/BalCard/BalCard.vue';
import { orderedTokenAddresses } from '@/composables/usePoolHelpers';
import { PoolToken } from '@/services/pool/types';
import router from '@/plugins/router';

/**
 * TYPES
 */
// type PointsGaugeTable = {
//   gauge: PointsGauge;
//   pool: GaugePool;
// };

/**
 * COMPOSABLES
 */
const { getToken, injectTokens } = useTokens();

const { isWalletReady } = useWeb3();

const {
  gauges: pointsGauges,
  gaugePools: pointsGaugePools,
  isLoading: isPointsClaimsLoading,
} = usePointsClaimsData();

/**
 * COMPUTED
 */
const loading = computed(
  (): boolean => isPointsClaimsLoading.value && isWalletReady.value
);
// const pointsAddress = computed(
//   () => configService.network.tokens.Addresses.POINTS
// );

// const pointsGaugesWithRewards = computed((): PointsGauge[] => {
//   if (!pointsAddress.value || pointsAddress.value === undefined) return [];
//   return pointsGauges.value.filter(gauge => {
//     return bnum(gauge.claimablePointsReward[pointsAddress.value!]).gt(0);
//   });
// });

// const pointsGaugeTables = computed((): PointsGaugeTable[] => {
//   // Only return gauges if we have a corresponding pool and rewards > 0
//   return pointsGaugesWithRewards.value.reduce<PointsGaugeTable[]>(
//     (arr, gauge) => {
//       const pool = pointsGaugePools.value.find(
//         pool => pool.id === gauge.poolId
//       );
//       console.log(pool);

//       if (pool)
//         arr.push({
//           gauge,
//           pool,
//         });

//       return arr;
//     },
//     []
//   );
// });

/**
 * METHODS
 */
async function injectRewardTokens(gauges: PointsGauge[]): Promise<void> {
  const allRewardTokens = gauges.map(gauge => gauge.rewardTokens).flat();
  return await injectTokens(allRewardTokens);
}

async function injectPoolTokens(pools: GaugePool[]): Promise<void> {
  const allPoolTokens = pools.map(pools => pools.tokensList).flat();
  return await injectTokens(allPoolTokens);
}

function symbolFor(token: PoolToken): string {
  return getToken(token.address)?.symbol || token.symbol || '---';
}

function goToPoolPage(id: string) {
  router.push({
    name: 'pool',
    params: {
      id,
      networkSlug,
    },
  });
}

/**
 * WATCHERS
 */
watch(pointsGauges, async newGauges => {
  if (newGauges) await injectRewardTokens(newGauges);
});

watch(pointsGaugePools, async newPools => {
  if (newPools) await injectPoolTokens(newPools);
});
</script>

<template>
  <div class="flex flex-col justify-center">
    <div
      class="flex justify-center items-center w-full text-3xl font-bold promo-bg"
    >
      <div class="px-4 lg:px-0 text-center"></div>
    </div>

    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-x-0 lg:gap-x-4 xl:gap-x-8 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-32 mt-8"
    >
      <BalLoadingBlock
        v-if="loading"
        class="col-span-7 p-4 md:px-8 lg:px-0 w-full h-56"
      />
      <div v-if="!loading" class="col-span-7 gap-y-4 p-4 px-4 md:px-8 lg:px-0">
        <h2 class="mb-4 font-bold">Blaze trails with Symmetric x Taiko</h2>
        <div class="text-white rounded-lg shadow-md">
          <h2 class="mb-4 text-2xl font-bold">How it Works</h2>
          <p class="mb-2">
            Boost your rewards by staking LP tokens in eligible pools to earn
            <span class="font-bold symm-points-gradient">SYMM Points</span> and
            <span class="font-bold text-blue-400">Trailblazers XP</span>. The
            more you stake, the more you earn!
          </p>
          <p class="mb-2">
            Swaps in eligible pools also rack up
            <span class="font-bold text-blue-400">Trailblazers XP</span>.
          </p>
          <p class="mb-2">
            Claim your
            <span class="font-bold symm-points-gradient">SYMM Points</span>
            anytime and redeem them during our exciting
            <span class="font-bold">Taiko Symmetric token launch</span>. Plus,
            trade
            <span class="font-bold text-blue-400">Trailblazers XP</span> for
            <span class="font-bold">TAIKO</span> at a future date!
          </p>
        </div>

        <div
          v-if="pointsGaugePools.length > 0"
          class="mt-5 mb-4 text-lg font-bold"
        >
          Eligible Pools
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="pool in pointsGaugePools"
            :key="pool.id"
            class="pool-card"
          >
            <BalCard
              class="h-full cursor-pointer"
              @click="goToPoolPage(pool.id)"
            >
              <div class="flex flex-col gap-y-2 p-4 hover:bg-gray-800">
                <div class="flex justify-start pt-4 pb-2 row">
                  <BalAssetSet
                    :addresses="orderedTokenAddresses(pool as any)"
                    :width="50"
                  />
                </div>
                <div class="flex justify-start">
                  {{
                    `${symbolFor(pool.tokens[0])}-${symbolFor(pool.tokens[1])}`
                  }}
                </div>
                <div class="flex justify-start text-xs text-secondary">
                  {{ pool.poolType }} pool
                </div>
                <div class="mt-3">
                  <div class="flex font-bold">Earn</div>
                  <div
                    class="inline-block text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500"
                  >
                    - SYMM Points
                  </div>
                  <div class="flex text-sm">- Trailblazers XP</div>
                </div>
              </div>
            </BalCard>
          </div>
        </div>
      </div>

      <div class="order-1 lg:order-2 col-span-5 px-4 lg:px-0">
        <BalLoadingBlock v-if="loading" class="mb-2 h-56" />
        <template v-if="!isPointsClaimsLoading">
          <div class="mb-16">
            <PointsRewardsTable
              :pointsGauges="pointsGauges"
              :pointsGaugePools="pointsGaugePools"
              :isLoading="isPointsClaimsLoading"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<style>
.pool-card {
  @apply flex flex-col h-full;
}

.promo-bg {
  background: url('/images/backgrounds/trailblazers-launch.png');
  background-size: contain; /* Change 'contain' to 'cover' for better responsiveness */
  height: 250px; /* Set a default height for small screens */
  @apply rounded-xl overflow-hidden relative bg-no-repeat bg-center;

  /* Responsive Adjustments */
  @media (min-width: 640px) {
    height: 300px; /* Medium screens */
  }
  @media (min-width: 768px) {
    height: 350px; /* Larger screens */
  }
  @media (min-width: 1024px) {
    height: 400px; /* Extra large screens */
  }
}

.symm-points-gradient {
  @apply inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500;
}
</style>