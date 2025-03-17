<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import AnimatePresence from '@/components/animate/AnimatePresence.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import useNetwork, {
  nativeSymbol,
  symmSymbol,
  veSymbol,
} from '@/composables/useNetwork';
import { useLpVault } from '@/composables/useLpVault';

type Props = {
  pool: Pool;
};
const props = defineProps<Props>();

const router = useRouter();

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { balanceFor } = useTokens();
const { totalLockedValue, lock, isLoadingLockInfo } = useLpVault();
const { isWalletReady } = useWeb3();
const { networkSlug } = useNetwork();

/**
 * COMPUTED
 */
const poolShares = computed(() =>
  bnum(props.pool.totalLiquidity).div(props.pool.totalShares)
);
const bptBalance = computed(() => balanceFor(props.pool.address));

const fiatTotal = computed(() =>
  poolShares.value.times(bptBalance.value).toString()
);

const navigateToLpVault = () => {
  router.push(`/${networkSlug}/lp-vault`);
};
</script>

<template>
  <div v-if="isWalletReady">
    <AnimatePresence :isVisible="!isLoadingLockInfo">
      <div class="relative">
        <BalAccordion
          :class="[
            'shadow-2xl overflow-visible',
            { 'pool-handle': !isLoadingLockInfo },
          ]"
          :sections="[
            {
              title: 'Locking',
              id: 'locking-module',
              handle: 'locking-handle',
              isDisabled: isLoadingLockInfo,
            },
          ]"
          :isOpenedByDefault="true"
        >
          <template #locking-handle>
            <button
              class="p-4 w-full hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <BalStack horizontal justify="between" align="center">
                <BalStack spacing="sm" horizontal>
                  <BalStack spacing="sm" align="center">
                    <div class="gold-effect">
                      <h6>{{ 'Taiko LP Vault' }}</h6>
                    </div>
                  </BalStack>
                </BalStack>
                <!-- <BalStack horizontal spacing="sm" align="center">
                  <BalIcon name="chevron-down" class="text-blue-500" />
                </BalStack> -->
              </BalStack>
            </button>
          </template>
          <template #locking-module>
            <div
              class="overflow-visible relative bg-white dark:bg-gray-850 rounded-b-lg"
            >
              <BalStack
                vertical
                spacing="sm"
                class="py-4 px-4 border-t dark:border-gray-900"
              >
                <BalStack horizontal justify="between">
                  <span v-if="!lock?.isExpired"
                    >{{ $t('locked') }} {{ $t('lpTokens') }}</span
                  >
                  <span v-else class="text-red-500">{{
                    $t('locking.expiredLockLpTokens')
                  }}</span>
                  <BalStack horizontal spacing="sm" align="center">
                    <AnimatePresence :isVisible="false">
                      <BalLoadingBlock class="h-5" />
                    </AnimatePresence>
                    <AnimatePresence :isVisible="true">
                      <span :class="{ 'text-red-500': lock?.isExpired }">
                        {{ fNum(totalLockedValue, FNumFormats.fiat) }}
                      </span>
                    </AnimatePresence>
                    <BalTooltip
                      v-if="!lock?.isExpired"
                      :text="
                        $t('lpVault.lockedLpTokensTooltip', {
                          veSymbol,
                          symmSymbol,
                          nativeAsset: nativeSymbol,
                        })
                      "
                    />
                    <BalTooltip
                      v-else
                      :text="$t('locking.expiredLockTooltip', { veSymbol })"
                    >
                      <template #activator>
                        <BalIcon
                          class="text-red-500"
                          size="sm"
                          name="alert-triangle"
                        />
                      </template>
                    </BalTooltip>
                  </BalStack>
                </BalStack>
                <BalStack horizontal justify="between">
                  <span>{{ $t('unlocked') }} {{ $t('lpTokens') }}</span>
                  <BalStack horizontal spacing="sm" align="center">
                    <AnimatePresence :isVisible="false">
                      <BalLoadingBlock class="h-5" />
                    </AnimatePresence>
                    <AnimatePresence :isVisible="true">
                      <span>
                        {{ fNum(fiatTotal, FNumFormats.fiat) }}
                      </span>
                    </AnimatePresence>
                    <BalTooltip
                      :text="
                        $t('lpVault.unlockedLpTokensTooltip', {
                          symmSymbol,
                          nativeAsset: nativeSymbol,
                        })
                      "
                    />
                  </BalStack>
                </BalStack>
                <BalStack horizontal spacing="sm" class="mt-2">
                  <BalBtn
                    :disabled="Number(bptBalance) === 0"
                    class="golden-btn"
                    size="sm"
                    @click="navigateToLpVault"
                  >
                    {{ $t('unlock') }}
                  </BalBtn>
                </BalStack>
              </BalStack>
            </div>
          </template>
        </BalAccordion>
      </div>
    </AnimatePresence>
    <AnimatePresence :isVisible="isLoadingLockInfo" unmountInstantly>
      <BalLoadingBlock class="h-12" />
    </AnimatePresence>
  </div>
</template>

<style>
.pool-handle {
  @apply rounded-xl;
}

.pool-handle::before {
  @apply absolute left-0 w-full opacity-100;

  content: '';
  top: -2px;
  height: calc(100% + 4px);
  background: linear-gradient(90deg, #a67c00, #daa520, #ffdc73, #a67c00);
  background-size: 400%;
  animation: anim-half 3s ease-out both;
  border-radius: 14px;
  z-index: -1;
}

.pool-handle:hover::before {
  animation: anim 12s linear infinite;
}

.pool-handle .bal-card {
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

.gold-effect {
  background: linear-gradient(
    to right,
    #a67c00,
    #daa520,
    #bf9b30,
    #ffdc73,
    #a67c00
  );
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 4px rgb(218 165 32 / 50%);
}

.golden-btn {
  background: linear-gradient(90deg, #a67c00, #daa520, #ffdc73, #a67c00);
  background-size: 300% 100%;
  color: #fff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 80%), 0 0 4px rgb(0 0 0 / 50%);
  transition: all 0.3s ease;
  border: none;
  animation: golden-shimmer 5s ease infinite;
  font-weight: bold;
}

.golden-btn:disabled {
  background: #ccc; /* or any other color you prefer for disabled state */
  color: #666; /* or any other color you prefer for disabled text */
  text-shadow: none;
  animation: none;
  opacity: 0.5;
  cursor: not-allowed;
}

.golden-btn:hover:not(:disabled) {
  background-size: 100% 100%;
  animation: none;
  background-position: 0% 0%;
  color: #fff;
  text-shadow: 0 1px 2px rgb(0 0 0 / 100%), 0 0 6px rgb(0 0 0 / 60%);
}

@keyframes golden-shimmer {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
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
