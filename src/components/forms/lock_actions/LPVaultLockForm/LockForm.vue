<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import usePoolQuery from '@/composables/queries/usePoolQuery';
import useVeBalLockInfoQuery from '@/composables/queries/useLPVaultLockInfoQuery';
// import useBreakpoints from '@/composables/useBreakpoints';
import { useTokens } from '@/providers/tokens.provider';
// import useVeBal from '@/composables/useVeBAL';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import HowToLock from './components/HowToLock.vue';
import MyVeBAL from './components/MyVeBAL.vue';
import VeBalForm from './components/VeBalForm/VeBalForm.vue';
import { ref } from 'vue';

/**
 * COMPOSABLES
 */
const { getToken } = useTokens();
const { isWalletReady } = useWeb3();
// const { lockablePoolId } = useVeBal();
// const { isDesktop, isMobile } = useBreakpoints();

/**
 * QUERIES
 */
const lockablePoolId = ref(
  '0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005'
);

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

console.log(lockablePool.value);

const lockablePoolTokenInfo = computed(() =>
  lockablePool.value != null ? getToken(lockablePool.value.address) : null
);

const veBalLockInfo = computed(() => veBalLockInfoQuery.data.value);

const isLoading = computed(() =>
  isWalletReady.value
    ? lockablePoolLoading.value || veBalQueryLoading.value
    : lockablePoolLoading.value
);
console.log(lockablePoolLoading.value, veBalQueryLoading.value);

const router = useRouter();
const goToPoolPage = () => {
  router.push(
    '/taiko/pool/0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005/add-liquidity'
  );
};
</script>

<template>
  <div class="px-4 sm:px-6 md:px-8 lg:px-12 mx-auto mt-12 max-w-7xl">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7 space-y-6">
        <!-- New introduction and description with lighter text -->
        <div class="mb-6">
          <h2 class="mb-4 text-3xl font-bold">
            Unlock Massive Rewards with Symmetric Taiko LP Vault!
          </h2>
          <div class="py-4 text-white rounded-lg shadow-md">
            <h2 class="mb-4 text-2xl font-bold">How it Works</h2>
            <p class="mb-2">
              Boost your earnings by locking your
              <span class="font-bold">80TAIKO-20WETH LP tokens</span> in a
              Symmetric Taiko LP Vault until
              <span class="font-bold">December 19th</span>. You'll enjoy a
              <span class="text-lg font-bold gold-effect">60x multiplier</span>
              on your
              <span class="font-bold text-blue-400">Taiko Trailblazers XP</span>
              based on the value of your locked tokens.
            </p>
            <p class="mb-2">
              Earn weekly
              <span class="font-bold symm-points-gradient">SYMM Points</span>
              rewards while your tokens are locked.
            </p>
            <p class="mb-2">
              Each week, you can apply a boost to your vault to maximize your
              reward power and increase your share of the weekly rewards,
              gaining even more
              <span class="font-bold symm-points-gradient">SYMM Points</span>.
            </p>
            <p class="mb-2">
              Lock your tokens now to supercharge your
              <span class="font-bold text-blue-400">Trailblazers XP</span> and
              maximize your
              <span class="font-bold symm-points-gradient">SYMM Points</span>
              rewards throughout the campaign!
            </p>
            <div class="mt-6">
              <button
                class="py-3 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out focus:outline-none"
                @click="goToPoolPage"
              >
                Get TAIKO-WETH LP Tokens
              </button>
            </div>
          </div>
        </div>

        <!-- Existing content -->
        <BalLoadingBlock
          v-if="isLoading || !lockablePool || !lockablePoolTokenInfo"
          class="h-12"
        />
        <HowToLock
          v-else
          :lockablePool="lockablePool"
          :lockablePoolTokenInfo="lockablePoolTokenInfo"
        />
      </div>

      <div class="lg:col-span-5 space-y-6">
        <BalLoadingBlock v-if="isLoading" class="h-64" />
        <MyVeBAL
          v-else-if="veBalLockInfo?.hasExistingLock"
          :veBalLockInfo="veBalLockInfo"
          :lockablePool="lockablePool"
          :lockablePoolTokenInfo="lockablePoolTokenInfo || undefined"
        />

        <BalLoadingBlock
          v-if="isLoading || !lockablePool || !lockablePoolTokenInfo"
          class="h-96"
        />
        <VeBalForm
          v-else
          :lockablePool="lockablePool"
          :lockablePoolTokenInfo="lockablePoolTokenInfo"
          :veBalLockInfo="veBalLockInfo"
        />
      </div>
    </div>
  </div>
</template>
<style>
.symm-points-gradient {
  @apply inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500;
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
</style>