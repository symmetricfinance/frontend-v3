<script setup lang="ts">
import { getAddress } from '@ethersproject/address';

import BalLoadingBlock from '@/components/_global/BalLoadingBlock/BalLoadingBlock.vue';
import AnimatePresence from '@/components/animate/AnimatePresence.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';

import StakePreviewModal from './StakePreviewModal.vue';
import { usePoolPointsStaking } from '@/providers/local/pool-points-staking.provider';

import { deprecatedDetails } from '@/composables/usePoolHelpers';
import { StakeAction } from './composables/useStakePreview';

type Props = {
  pool: Pool;
};
const props = defineProps<Props>();

/**
 * STATE
 */

const isStakePreviewVisible = ref(false);
const stakeAction = ref<StakeAction>('stakeForPoints');
const isOpenedByDefault = ref(true);
/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { balanceFor } = useTokens();
const {
  isStakablePool,
  isLoading: isLoadingStakingData,
  isRefetchingStakedShares,
  stakedShares,
  pointsGaugeAddress,
} = usePoolPointsStaking();

const isDeprecated = computed(() => {
  return (
    props.pool.id ===
    '0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005'
  );
});

console.log(stakedShares.value);

/**
 * COMPUTED
 */

const fiatValueOfStakedShares = computed(() => {
  return bnum(props.pool.totalLiquidity)
    .div(props.pool.totalShares)
    .times((stakedShares.value || '0').toString())
    .toString();
});

const fiatValueOfUnstakedShares = computed(() => {
  return bnum(props.pool.totalLiquidity)
    .div(props.pool.totalShares)
    .times(balanceFor(getAddress(props.pool.address)))
    .toString();
});

const isStakeDisabled = computed(() => {
  return (
    !!deprecatedDetails(props.pool.id) ||
    fiatValueOfUnstakedShares.value === '0' ||
    !pointsGaugeAddress.value
  );
});

const cardTitle = computed(() => {
  return isDeprecated.value ? 'Unstake your LP tokens' : 'Earn SYMM Points';
});

const shouldShowComponent = computed(() => {
  if (isDeprecated.value) {
    return bnum(fiatValueOfStakedShares.value).gt(0);
  }
  return true;
});

/**
 * METHODS
 */
function showStakePreview() {
  if (fiatValueOfUnstakedShares.value === '0') return;
  stakeAction.value = 'stakeForPoints';
  isStakePreviewVisible.value = true;
}

function showUnstakePreview() {
  if (fiatValueOfStakedShares.value === '0') return;
  stakeAction.value = 'unstakeForPoints';
  isStakePreviewVisible.value = true;
}

function handlePreviewClose() {
  isStakePreviewVisible.value = false;
}
</script>

<template>
  <div v-if="shouldShowComponent">
    <AnimatePresence :isVisible="!isLoadingStakingData">
      <div class="relative">
        <BalAccordion
          :class="['shadow-2xl', { handle: isStakablePool && !isDeprecated }]"
          :sections="[
            {
              title: cardTitle,
              id: 'staking-incentives',
              handle: 'staking-handle',
              isDisabled: isStakablePool && !isDeprecated,
            },
          ]"
          :reCalcKey="1"
          :isOpenedByDefault="isOpenedByDefault"
        >
          <template #staking-handle>
            <button
              class="p-4 w-full hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <BalStack horizontal justify="between" align="center">
                <BalStack spacing="sm" align="center">
                  <div
                    :class="[
                      'inline-block bg-clip-text',
                      {
                        'text-transparent bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500':
                          !isDeprecated,
                        'text-red-500': isDeprecated,
                      },
                    ]"
                  >
                    <h6>
                      {{ cardTitle }}
                    </h6>
                  </div>
                </BalStack>
                <BalStack
                  v-if="isStakablePool && !isDeprecated"
                  horizontal
                  spacing="sm"
                  align="center"
                >
                  <BalTooltip :text="$t('staking.pointsIncentivesTooltip')" />
                </BalStack>
              </BalStack>
            </button>
          </template>
          <template #staking-incentives>
            <div class="relative bg-white dark:bg-gray-850 rounded-b-lg">
              <BalStack
                vertical
                spacing="sm"
                class="p-4 rounded-b-lg border-t dark:border-gray-900"
              >
                <div v-if="isDeprecated">
                  <BalAlert
                    type="warning"
                    title="Please remove your LP tokens"
                    class="mb-4"
                  >
                    Rewards for this pool have now been moved to the new Taiko
                    LP Vault
                  </BalAlert>
                </div>

                <BalStack horizontal justify="between" class="rounded-b-lg">
                  <span>{{ $t('staked') }} {{ $t('lpTokens') }}</span>
                  <BalStack horizontal spacing="sm" align="center">
                    <AnimatePresence :isVisible="isRefetchingStakedShares">
                      <BalLoadingBlock class="h-5" />
                    </AnimatePresence>
                    <AnimatePresence :isVisible="!isRefetchingStakedShares">
                      <span>
                        {{ fNum(fiatValueOfStakedShares, FNumFormats.fiat) }}
                      </span>
                    </AnimatePresence>
                    <BalTooltip :text="$t('staking.stakedLpTokensTooltip')" />
                  </BalStack>
                </BalStack>
                <BalStack v-if="!isDeprecated" horizontal justify="between">
                  <span>{{ $t('unstaked') }} {{ $t('lpTokens') }}</span>
                  <BalStack horizontal spacing="sm" align="center">
                    <AnimatePresence :isVisible="isRefetchingStakedShares">
                      <BalLoadingBlock class="h-5" />
                    </AnimatePresence>
                    <AnimatePresence :isVisible="!isRefetchingStakedShares">
                      <span>
                        {{ fNum(fiatValueOfUnstakedShares, FNumFormats.fiat) }}
                      </span>
                    </AnimatePresence>
                    <BalTooltip :text="$t('staking.unstakedLpTokensTooltip')" />
                  </BalStack>
                </BalStack>
                <BalStack horizontal spacing="sm" class="mt-2">
                  <BalBtn
                    v-if="!isDeprecated"
                    color="gradient"
                    size="sm"
                    :disabled="isStakeDisabled"
                    @click="showStakePreview"
                  >
                    {{ $t('stake') }}
                  </BalBtn>
                  <BalBtn
                    outline
                    color="blue"
                    size="sm"
                    :disabled="fiatValueOfStakedShares === '0'"
                    @click="showUnstakePreview"
                  >
                    {{ $t('unstake') }}
                  </BalBtn>
                </BalStack>
                <!-- <BalAlert
                  v-if="networkId === Network.MAINNET"
                  :title="$t('staking.restakeGauge')"
                  class="mt-2"
                >
                  {{ $t('staking.restakeGaugeDescription') }}
                </BalAlert> -->
              </BalStack>
            </div>
          </template>
        </BalAccordion>
      </div>
    </AnimatePresence>
    <AnimatePresence :isVisible="isLoadingStakingData" unmountInstantly>
      <BalLoadingBlock class="h-12" />
    </AnimatePresence>
    <StakePreviewModal
      :isVisible="isStakePreviewVisible"
      :pool="pool"
      :action="stakeAction"
      @close="handlePreviewClose"
    />
  </div>
</template>

<style>
.handle {
  @apply overflow-hidden rounded-xl;
}

.handle::before {
  @apply absolute left-0 w-full opacity-100;

  content: '';
  top: -2px;
  height: calc(100% + 4px);
  background: linear-gradient(90deg, #4254ff, #f441a5, #ffeb3b, #4254ff);
  background-size: 400%;
  animation: anim-half 3s ease-out both;
  border-radius: 14px;
  z-index: -1;
}

.handle:hover::before {
  animation: anim 12s linear infinite;
}

.handle .bal-card {
  @apply mx-auto;

  width: calc(100% - 4px);
}

@keyframes anim-half {
  from {
    background-position: 0;
  }

  to {
    background-position: 125%;
  }
}

@keyframes anim {
  from {
    background-position: 125%;
  }

  to {
    background-position: 600%;
  }
}
</style>
