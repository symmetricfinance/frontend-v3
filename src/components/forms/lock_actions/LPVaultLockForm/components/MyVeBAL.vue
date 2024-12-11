<script setup lang="ts">
import { format } from 'date-fns';
import { computed, ref, onUnmounted } from 'vue';

import { PRETTY_DATE_FORMAT } from '@/components/forms/lock_actions/constants';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';

import { bnum } from '@/lib/utils';
import { VeBalLockInfo } from '@/services/balancer/contracts/contracts/veBAL';
import { Pool } from '@/services/pool/types';
import { useTokens } from '@/providers/tokens.provider';
import LockActions from '../components/LockPreviewModal/components/LockActions.vue';
import { LockType } from '@/components/forms/lock_actions/LockForm/types';
import { TokenInfo } from '@/types/TokenList';
import useVeBalLockInfoQuery from '@/composables/queries/useVeBalLockInfoQuery';

/**
 * TYPES
 */
type Props = {
  veBalLockInfo?: VeBalLockInfo;
  lockablePool: Pool | undefined;
  lockablePoolTokenInfo: TokenInfo | undefined;
};

/**
 * PROPS
 */
const props = defineProps<Props>();
const displayLockEndDate = ref('1734307200000');

/**
 * COMPOSABLES
 */
const { refetch: refetchLockInfo } = useVeBalLockInfoQuery();
const { fNum } = useNumbers();
const { balanceFor } = useTokens();

/**
 * COMPUTED
 */
const lockAmountFiatValue = computed(() =>
  bnum(props.lockablePool?.totalLiquidity || 0)
    .div(props.lockablePool?.totalShares || 1)
    .times(props.veBalLockInfo?.lockedAmount ?? 0)
    .toString()
);

const unlockedLPBalance = computed(() => {
  if (!props.lockablePool) return '0';
  return balanceFor(props.lockablePool.address);
});

const lockConfirmed = ref(false);

const lockEndDate = computed(() => {
  const today = new Date();
  const dayOfWeek = today.getUTCDay();
  const daysToSubtract = (dayOfWeek + 7 - 4) % 7;
  const lastThursday = new Date(
    today.setUTCDate(today.getUTCDate() - daysToSubtract)
  );
  lastThursday.setUTCHours(0, 0, 0, 0);
  const tenWeeksAhead = new Date(
    lastThursday.getTime() + 10 * 7 * 24 * 60 * 60 * 1000
  );
  const tenWeeksAheadTimestamp = Math.floor(tenWeeksAhead.getTime());
  console.log('tenWeeksAheadTimestamp', tenWeeksAheadTimestamp);
  return tenWeeksAheadTimestamp;
});

const isLockAlreadyExtended = computed(() => {
  if (!props.veBalLockInfo?.hasExistingLock) return false;
  const currentLockEnd = new Date(props.veBalLockInfo?.lockedEndDate);
  const currentLockEndUTC = Date.UTC(
    currentLockEnd.getUTCFullYear(),
    currentLockEnd.getUTCMonth(),
    currentLockEnd.getUTCDate()
  );
  console.log(
    'Current lock end (UTC):',
    new Date(currentLockEndUTC).toUTCString()
  );

  const proposedLockEnd = new Date(lockEndDate.value);
  const proposedLockEndUTC = Date.UTC(
    proposedLockEnd.getUTCFullYear(),
    proposedLockEnd.getUTCMonth(),
    proposedLockEnd.getUTCDate()
  );
  console.log(
    'Proposed lock end (UTC):',
    new Date(proposedLockEndUTC).toUTCString()
  );

  return currentLockEndUTC >= proposedLockEndUTC;
});

const timeUntilNextBoost = ref('');

const calculateNextBoost = () => {
  const now = new Date();
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );

  // Find the next Thursday
  let nextThursday = new Date(nowUTC);
  nextThursday.setUTCDate(
    nextThursday.getUTCDate() + ((4 + 7 - nextThursday.getUTCDay()) % 7)
  );
  nextThursday.setUTCHours(0, 0, 0, 0);

  // If it's already past Thursday 00:00 UTC, get the next Thursday
  if (nextThursday.getTime() <= nowUTC) {
    nextThursday = new Date(nextThursday.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  return nextThursday;
};

const updateCountdown = () => {
  const now = new Date();
  const nextBoost = calculateNextBoost();
  const diff = nextBoost.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  timeUntilNextBoost.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

// Update the countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);

// Clean up the interval when the component is unmounted
onUnmounted(() => {
  clearInterval(countdownInterval);
});

// Initial update
updateCountdown();

/**
 * METHODS
 */
async function handleSuccess() {
  lockConfirmed.value = true;
  refetchLockInfo();
}
</script>

<template>
  <BalCard noPad shadow="none">
    <div class="p-4 w-full border-b dark:border-gray-900">
      <h6>{{ 'Your Vault Summary' }}</h6>
    </div>
    <div class="p-4">
      <ul class="space-y-4">
        <li class="flex justify-between items-center">
          <span class="text-gray-400 dark:text-gray-300">Locked Balance:</span>
          <div class="text-right">
            <div class="font-semibold text-gray-900 dark:text-gray-100">
              {{ fNum(lockAmountFiatValue, FNumFormats.fiat) }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{
                fNum(props.veBalLockInfo?.lockedAmount ?? 0, FNumFormats.token)
              }}
              {{ props.lockablePool?.symbol }}
            </div>
          </div>
        </li>
        <li class="flex justify-between items-center">
          <span class="text-gray-400 dark:text-gray-300"
            >Unlocked LP Balance:</span
          >
          <div class="text-gray-900 dark:text-gray-100">
            {{ fNum(unlockedLPBalance, FNumFormats.token) }}
            {{ props.lockablePool?.symbol }}
          </div>
        </li>
        <li class="flex justify-between items-center">
          <span class="text-gray-400 dark:text-gray-300">Lock End Date:</span>
          <div class="text-gray-900 dark:text-gray-100">
            {{
              props.veBalLockInfo?.hasExistingLock
                ? format(
                    new Date(Number(displayLockEndDate)),
                    PRETTY_DATE_FORMAT
                  )
                : '-'
            }}
          </div>
        </li>
        <li class="flex justify-between items-center">
          <span class="text-gray-400 dark:text-gray-300"
            >Time Until Next Boost:</span
          >
          <div class="text-gray-900 dark:text-gray-100">
            {{ timeUntilNextBoost }}
          </div>
        </li>
        <li
          v-if="props.veBalLockInfo?.hasExistingLock"
          class="flex justify-between items-center"
        >
          <span class="text-gray-400 dark:text-gray-300">Weekly Boost:</span>
          <div class="flex flex-row">
            <div v-if="isLockAlreadyExtended">
              <span class="text-green-500">Weekly Boost Applied 🚀</span>
            </div>
            <LockActions
              v-else-if="props.veBalLockInfo && props.lockablePoolTokenInfo"
              :veBalLockInfo="props.veBalLockInfo"
              :lockConfirmed="lockConfirmed"
              :lockAmount="'0'"
              :lockEndDate="lockEndDate.toString()"
              :lockType="[LockType.EXTEND_LOCK]"
              :lockablePoolTokenInfo="props.lockablePoolTokenInfo"
              class="mt-4"
              @success="handleSuccess"
            />
            <BalTooltip
              :text="$t('getLpVault.weeklyBoost.tooltip')"
              iconSize="sm"
              class="mt-1 ml-2"
            />
          </div>
        </li>
      </ul>
    </div>
  </BalCard>
</template>
