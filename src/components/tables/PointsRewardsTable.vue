<script lang="ts" setup>
import { formatUnits } from '@ethersproject/units';
import { computed } from 'vue';
// import { useI18n } from 'vue-i18n';

// import { ColumnDefinition } from '@/components/_global/BalTable/types';

import ClaimPointsRewardsBtn from '@/components/btns/ClaimRewardsBtn/ClaimPointsRewardsBtn.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { bnum } from '@/lib/utils';
import { PointsGauge } from '@/services/balancer/gauges/types';
import { configService } from '@/services/config/config.service';
import AnimatePresence from '@/components/animate/AnimatePresence.vue';
import { GaugePool } from '@/composables/usePointsClaimsData';

/**
 * TYPES
 */
type Props = {
  pointsGauges: PointsGauge[];
  pointsGaugePools: GaugePool[];
  lpVaultPoints: string;
  isLoading: boolean;
};

type Reward = {
  gauge: PointsGauge;
  pool: GaugePool;
  amount: string;
  value: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const { balanceFor } = useTokens();

const pointsAddress = configService.network.tokens.Addresses.POINTS;

const pointsBalance = computed(() => {
  if (!pointsAddress) return '0';
  return Number(balanceFor(pointsAddress));
});

/**
 * COMPOSABLES
 */
// const { t } = useI18n();
const { fNum } = useNumbers();

/**
 * STATE
 */
// const columns = ref<ColumnDefinition<Reward>[]>([
//   {
//     name: t('pools'),
//     id: 'icons',
//     accessor: 'icons',
//     Cell: 'iconsColumnCell',
//     width: 50,
//     noGrow: true,
//   },
//   {
//     name: '',
//     id: 'pills',
//     accessor: 'pills',
//     Cell: 'pillsColumnCell',
//     width: 200,
//   },
//   {
//     name: 'Points',
//     id: 'amount',
//     align: 'right',
//     width: 150,
//     totalsCell: 'totalAmountCell',
//     accessor: ({ amount }) => `${fNum(amount, FNumFormats.token)} SYMM Points`,
//   },
//   {
//     name: '',
//     id: 'claim',
//     accessor: 'claim',
//     Cell: 'claimColumnCell',
//     totalsCell: 'totalClaimCell',
//     width: 100,
//   },
// ]);

/**
 * COMPUTED
 */
const rewardsData = computed((): Reward[] => {
  if (!pointsAddress) return [];
  return props.pointsGauges
    .map(gauge => {
      const amount = formatUnits(
        gauge.claimablePointsReward[pointsAddress],
        18
      );

      if (bnum(amount).isZero()) return null;

      return {
        gauge,
        pool: props.pointsGaugePools.find(p => p.id === gauge.poolId),
        amount,
        value: '0',
      };
    })
    .filter(r => r !== null) as Reward[];
});

const gaugesWithRewardsAddresses = computed((): string[] => {
  return rewardsData.value.map(reward => reward.gauge.id);
});

const totalPoints = computed((): string => {
  return rewardsData.value
    .reduce((acc, reward) => acc.plus(bnum(reward.amount)), bnum('0'))
    .toString();
});
</script>

<template>
  <div>
    <AnimatePresence>
      <div class="relative">
        <BalCard>
          <button
            class="p-4 w-full hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <BalStack horizontal justify="between" align="center">
              <BalStack spacing="sm" align="center">
                <div
                  class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500"
                >
                  <h6>Your SYMM Points</h6>
                </div>
              </BalStack>
              <BalStack horizontal spacing="sm" align="center">
                <BalTooltip :text="$t('staking.pointsIncentivesTooltip')" />
              </BalStack>
            </BalStack>
          </button>
          <div class="relative bg-white dark:bg-gray-850 rounded-b-lg">
            <BalStack
              vertical
              spacing="sm"
              class="p-4 rounded-b-lg border-t dark:border-gray-900"
            >
              <BalStack horizontal justify="between">
                <span class="font-bold">Total Points</span>
                <BalStack horizontal spacing="sm" align="center">
                  <AnimatePresence :isVisible="false">
                    <BalLoadingBlock class="h-5" />
                  </AnimatePresence>
                  <AnimatePresence :isVisible="true">
                    <span class="font-bold">
                      {{ fNum(pointsBalance, FNumFormats.token) }} Points
                    </span>
                  </AnimatePresence>
                </BalStack>
              </BalStack>
              <BalStack horizontal justify="between" class="rounded-b-lg">
                <span> Claimable Points:</span>
                <BalStack horizontal spacing="sm" align="center">
                  <AnimatePresence :isVisible="false">
                    <BalLoadingBlock class="h-5" />
                  </AnimatePresence>
                  <AnimatePresence :isVisible="true">
                    <span
                      >{{ fNum(totalPoints, FNumFormats.token) }} Points</span
                    >
                  </AnimatePresence>
                </BalStack>
              </BalStack>
              <BalStack horizontal justify="between" class="rounded-b-lg">
                <span> Claimable LP Vault Points:</span>
                <BalStack horizontal spacing="sm" align="center">
                  <AnimatePresence :isVisible="false">
                    <BalLoadingBlock class="h-5" />
                  </AnimatePresence>
                  <AnimatePresence :isVisible="true">
                    <span
                      >{{ fNum(lpVaultPoints, FNumFormats.token) }} Points</span
                    >
                  </AnimatePresence>
                </BalStack>
              </BalStack>
              <BalStack horizontal justify="end" spacing="sm" class="mt-2">
                <ClaimPointsRewardsBtn
                  :gauges="gaugesWithRewardsAddresses"
                  :totalAmount="totalPoints"
                />
              </BalStack>
              <!-- <ClaimPointsRewardsBtn
                v-if="!isLoading"
                :gauges="gaugesWithRewardsAddresses"
                :totalAmount="totalPoints"
              /> -->
            </BalStack>
          </div>
        </BalCard>
      </div>
    </AnimatePresence>
  </div>

  <!-- <BalCard
    shadow="lg"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :columns="columns"
      :data="rewardsData"
      :noResultsLabel="
        $t('noResultsTable.noBalIncentives', { POINTS: 'POINTS' })
      "
      :isLoading="isLoading"
      skeletonClass="h-64"
      :square="upToLargeBreakpoint"
    >
      <template #iconsColumnCell="{ pool }">
        <div class="px-6 py-4">
          <BalAssetSet :addresses="orderedTokenAddresses(pool)" :width="100" />
        </div>
      </template>
      <template #pillsColumnCell="{ pool }">
        <div class="flex items-center px-6 py-4">
          <TokenPills
            :tokens="orderedPoolTokens(pool, pool.tokens)"
            :isStablePool="isStableLike(pool.poolType)"
          />
          <PoolWarningTooltip :pool="pool" />
        </div>
      </template>
      <template #totalAmountCell>
        <div class="flex justify-end">
          {{ fNum(totalPoints, FNumFormats.token) }} SYMM Points
        </div>
      </template>
      <template #totalClaimCell>
        <ClaimPointsRewardsBtn
          :gauges="gaugesWithRewardsAddresses"
          :totalAmount="totalPoints"
        />
      </template>
    </BalTable>
  </BalCard> -->
</template>
