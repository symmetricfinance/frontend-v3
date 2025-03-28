<script setup lang="ts">
import { computed } from 'vue';

import usePoolQuery from '@/composables/queries/usePoolQuery';
import useVeBalLockInfoQuery from '@/composables/queries/useOldLPVaultLockInfoQuery';
import { useTokens } from '@/providers/tokens.provider';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import VeBalUnlockForm from './components/VeBalUnlockForm/VeBalUnlockForm.vue';

/**
 * COMPOSABLES
 */
const { getToken } = useTokens();
const { isWalletReady } = useWeb3();

const lockablePoolId = ref(
  '0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005'
);

/**
 * QUERIES
 */
const lockablePoolQuery = usePoolQuery(lockablePoolId.value as string);
const veBalLockInfoQuery = useVeBalLockInfoQuery();

/**
 * COMPUTED
 */
const lockablePoolLoading = computed(() => lockablePoolQuery.isLoading.value);

const veBalQueryLoading = computed(() => veBalLockInfoQuery.isLoading.value);

const lockablePool = computed<Pool | undefined>(
  () => lockablePoolQuery.data.value
);

const lockablePoolTokenInfo = computed(() =>
  lockablePool.value != null ? getToken(lockablePool.value.address) : null
);

const veBalLockInfo = computed(() => veBalLockInfoQuery.data.value);
console.log('veBalLockInfo', veBalLockInfo.value);

const isLoading = computed(() =>
  isWalletReady.value
    ? lockablePoolLoading.value || veBalQueryLoading.value
    : lockablePoolLoading.value
);
</script>

<template>
  <BalLoadingBlock
    v-if="
      isLoading || !veBalLockInfo || !lockablePool || !lockablePoolTokenInfo
    "
    class="h-96"
  />
  <VeBalUnlockForm
    v-else
    :key="
      veBalLockInfo?.hasExistingLock
        ? 'veBalUnlockForm-hasLock'
        : 'veBalUnlockForm-noLock'
    "
    :lockablePool="lockablePool"
    :lockablePoolTokenInfo="lockablePoolTokenInfo"
    :veBalLockInfo="veBalLockInfo"
  />
</template>

