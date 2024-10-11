<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';
import {
  addDays,
  isThursday,
  // nextThursday,
  previousThursday,
} from 'date-fns';

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

const maxLockEndDateTimestamp = computed(() => {
  return getMaxLockEndDateTimestamp(Date.now());
});
console.log('maxLockEndDateTimestamp', maxLockEndDateTimestamp.value);

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
    console.log('isIncreasedLockAmount.value', isIncreasedLockAmount.value);
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

function getMaxLockEndDateTimestamp(date: number) {
  const maxLockTimestamp = addDays(date, 70);
  console.log('maxLockTimestamp', maxLockTimestamp);

  const timestamp = isThursday(maxLockTimestamp)
    ? maxLockTimestamp
    : previousThursday(maxLockTimestamp);
  return timestamp.toDateString();
}

const lockTitle = computed(() => {
  if (props.veBalLockInfo?.hasExistingLock) {
    return 'Add to your Vault';
  }
  return 'Create your Vault';
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
        <div class="flex justify-between items-center">
          <h6>
            {{ lockTitle }}
          </h6>
          <BalLink
            href="#"
            external
            class="text-sm"
            @click.prevent="navigateToLPTokenPage"
          >
            Get 80TAIKO-20WETH LP
          </BalLink>
        </div>
      </div>
    </template>

    <LockAmount
      :lockablePool="lockablePool"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
    />

    <!-- <LockEndDate
      :minLockEndDateTimestamp="minLockEndDateTimestamp"
      :maxLockEndDateTimestamp="maxLockEndDateTimestamp"
      :veBalLockInfo="veBalLockInfo"
    /> -->

    <!-- <Summary :expectedVeBalAmount="expectedVeBalAmount" /> -->

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
