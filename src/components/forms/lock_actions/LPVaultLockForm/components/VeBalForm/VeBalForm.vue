<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';
// import {
//   //addDays,
//   //isThursday,
//   // nextThursday,
//   //previousThursday,
//   // parseISO,
//   subDays,
//   // startOfDay,
//   // nextThursday,
//   // previousThursday,
//   // addWeeks,
// } from 'date-fns';

import { LockType } from '@/components/forms/lock_actions/LockForm/types';
import { useTokens } from '@/providers/tokens.provider';
// import { expectedVeBal } from '@/composables/useVeBAL';
import { bnum } from '@/lib/utils';
import { VeBalLockInfo } from '@/services/balancer/contracts/contracts/veBAL';
// import { configService } from '@/services/config/config.service';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { TokenInfo } from '@/types/TokenList';

import useLockAmount from '../../composables/useLockAmount';
import useLockEndDate from '../../composables/useLockEndDate';
import useLockState from '../../composables/useLockState';
import LockPreviewModal from '../LockPreviewModal/LockPreviewModal.vue';
import LockAmount from './components/LockAmount.vue';
// import LockEndDate from './components/LockEndDate.vue';
// import Summary from './components/Summary.vue';
// import { veSymbol } from '@/composables/useNetwork';

// Add this import
import BalLink from '@/components/_global/BalLink/BalLink.vue';

/**
 * TYPES
 */
type Props = {
  lockablePool: Pool;
  lockablePoolTokenInfo: TokenInfo;
  veBalLockInfo?: VeBalLockInfo;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * STATE
 */
const showPreviewModal = ref(false);

const { lockAmount } = useLockState();
const { isWalletReady, startConnectWithInjectedProvider, isMismatchedNetwork } =
  useWeb3();

const { isValidLockAmount, isIncreasedLockAmount, totalLpTokens } =
  useLockAmount(toRef(props, 'veBalLockInfo'));

const {
  // minLockEndDateTimestamp,
  // maxLockEndDateTimestamp,
  isExtendedLockEndDate,
} = useLockEndDate(props.veBalLockInfo);

// const minLockEndDateTimestamp = ref('1734566400');

const maxLockEndDateTimestamp = ref(getUnixTimestamp());

function getUnixTimestamp() {
  const today = new Date();
  const dayOfWeek = today.getUTCDay();
  const daysToSubtract = (dayOfWeek + 7 - 4) % 7;
  const lastThursday = new Date(
    today.setUTCDate(today.getUTCDate() - daysToSubtract)
  );
  lastThursday.setUTCHours(0, 0, 0, 0);
  const fourteenWeeksAhead = new Date(
    lastThursday.getTime() + 14 * 7 * 24 * 60 * 60 * 1000
  );
  const fourteenWeeksAheadTimestamp = Math.floor(fourteenWeeksAhead.getTime());
  console.log('fourteenWeeksAheadTimestamp', fourteenWeeksAheadTimestamp);
  return fourteenWeeksAheadTimestamp;
}

const SEASON_3_END_TIMESTAMP = 1709251200; // March 1, 2024 00:00:00 UTC

const isLockingEnded = computed(() => {
  return Math.floor(Date.now() / 1000) > SEASON_3_END_TIMESTAMP;
});

/**
 * COMPOSABLES
 */
const { balanceFor } = useTokens();
const router = useRouter();

/**
 * COMPUTED
 */
const lockablePoolBptBalance = computed(() =>
  balanceFor(props.lockablePool.address)
);

const submissionDisabled = computed(() => {
  if (isMismatchedNetwork.value) {
    return true;
  }

  if (props.veBalLockInfo?.hasExistingLock && !props.veBalLockInfo?.isExpired) {
    return !isIncreasedLockAmount.value && !isExtendedLockEndDate.value;
  }

  return !bnum(lockablePoolBptBalance.value).gt(0) || !isValidLockAmount.value;
});

// const expectedVeBalAmount = computed(() => {
//   if (submissionDisabled.value) {
//     return '0';
//   }

//   return expectedPower(totalLpTokens.value, maxLockEndDateTimestamp.value);
// });

const lockType = computed(() => {
  if (props.veBalLockInfo?.hasExistingLock && !props.veBalLockInfo?.isExpired) {
    if (isIncreasedLockAmount.value && isExtendedLockEndDate.value) {
      return [LockType.INCREASE_LOCK, LockType.EXTEND_LOCK];
    }
    if (isExtendedLockEndDate.value) {
      return [LockType.EXTEND_LOCK];
    }
    if (isIncreasedLockAmount.value) {
      return [LockType.INCREASE_LOCK];
    }
  }
  return [LockType.CREATE_LOCK];
});

/**
 * METHODS
 */
function handleClosePreviewModal() {
  showPreviewModal.value = false;
}

function handleShowPreviewModal() {
  if (submissionDisabled.value) return;
  showPreviewModal.value = true;
}

// function getMaxLockEndDateTimestamp(): string {
//   try {
//     const currentDate = parseISO(Date.now().toString());
//     const startOfToday = startOfDay(currentDate);

//     // Find the previous Thursday
//     let prevThursday = previousThursday(startOfToday);
//     if (prevThursday.getTime() === startOfToday.getTime()) {
//       prevThursday = subDays(prevThursday, 7);
//     }

//     // Add 10 weeks to the previous Thursday
//     const maxLockDate = addWeeks(prevThursday, 10);
//     return maxLockDate.toISOString(); // Return as ISO 8601 string
//   } catch (error) {
//     console.error('Error fetching current time:', error);
//     // Fallback to a default date if API call fails (10 weeks from a fixed date)
//     return '2024-12-19T00:00:00Z'; // This is 10 weeks from 2024-10-10 00:00:00 UTC
//   }
// }

// Update the usage of getMaxLockEndDateTimestamp
// getMaxLockEndDateTimestamp().then(dateString => {
//   console.log('Max lock end date:', dateString);
//   maxLockEndDateTimestamp.value = dateString;
// });

const lockTitle = computed(() => {
  if (props.veBalLockInfo?.hasExistingLock) {
    return 'Add to your Vault';
  }
  return 'Create your S3 Vault';
});

const buttonLabel = computed(() => {
  if (props.veBalLockInfo?.hasExistingLock) {
    return 'Add to your Vault';
  }
  return 'Create your Vault';
});

function navigateToLPTokenPage() {
  router.push(
    '/taiko/pool/0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005/add-liquidity'
  );
}
</script>

<template>
  <BalCard shadow="xl" exposeOverflow noBorder>
    <template #header>
      <div class="w-full">
        <template v-if="isLockingEnded">
          <BalCard
            class="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20"
          >
            <div class="text-center">
              <h5 class="mb-2 text-red-500">
                Season 3 LP Vault Locking Has Ended
              </h5>
              <p class="text-sm text-gray-400">
                The locking period for Season 3 has concluded. Stay tuned for
                future opportunities. Locked tokens can be unlocked March 17th
                2025.
              </p>
            </div>
          </BalCard>
        </template>
        <template v-else>
          <div class="flex justify-between items-center">
            <h5>
              {{ lockTitle }}
            </h5>
            <BalLink
              href="#"
              external
              class="text-sm"
              @click.prevent="navigateToLPTokenPage"
            >
              Get 80TAIKO-20WETH LP
            </BalLink>
          </div>

          <LockAmount
            :lockablePool="lockablePool"
            :lockablePoolTokenInfo="lockablePoolTokenInfo"
          />

          <div class="mt-6">
            <BalBtn
              v-if="!isWalletReady"
              :label="$t('connectWallet')"
              color="gradient"
              block
              @click="startConnectWithInjectedProvider"
            />
            <BalBtn
              v-else
              color="gradient"
              block
              :disabled="submissionDisabled"
              @click="handleShowPreviewModal"
            >
              {{ buttonLabel }}
            </BalBtn>
          </div>
        </template>
      </div>
    </template>
  </BalCard>

  <teleport to="#modal">
    <LockPreviewModal
      v-if="showPreviewModal && veBalLockInfo"
      :lockablePool="lockablePool"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
      :lockAmount="lockAmount"
      :lockEndDate="maxLockEndDateTimestamp.toString()"
      :lockType="lockType"
      :veBalLockInfo="veBalLockInfo"
      :totalLpTokens="totalLpTokens"
      @close="handleClosePreviewModal"
    />
  </teleport>
</template>
