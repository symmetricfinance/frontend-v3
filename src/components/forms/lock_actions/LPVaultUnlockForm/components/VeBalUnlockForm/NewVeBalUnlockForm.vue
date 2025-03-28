<script setup lang="ts">
import { computed, ref } from 'vue';

import { bnum } from '@/lib/utils';
import { VeBalLockInfo } from '@/services/balancer/contracts/contracts/veBAL';
// import { configService } from '@/services/config/config.service';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { TokenInfo } from '@/types/TokenList';

import LockedAmount from './components/LockedAmount.vue';
import NewUnlockPreviewModal from '../UnlockPreviewModal/NewUnlockPreviewModal.vue';
// import { veSymbol } from '@/composables/useNetwork';

/**
 * TYPES
 */
type Props = {
  lockablePool: Pool;
  lockablePoolTokenInfo: TokenInfo;
  veBalLockInfo: VeBalLockInfo;
};

/**
 * PROPS
 */
const props = defineProps<Props>();
console.log('veBalLockInfo', props.veBalLockInfo);

/**
 * STATE
 */
const showPreviewModal = ref(false);

/**
 * COMPOSABLES
 */
const { isWalletReady, startConnectWithInjectedProvider, isMismatchedNetwork } =
  useWeb3();

/**
 * COMPUTED
 */
const totalLpTokens = computed(() => props.veBalLockInfo.lockedAmount);

const fiatTotalLpTokens = computed(() =>
  bnum(props.lockablePool.totalLiquidity)
    .div(props.lockablePool.totalShares)
    .times(totalLpTokens.value)
    .toString()
);

const submissionDisabled = computed(() => {
  if (isMismatchedNetwork.value) {
    return true;
  }

  return bnum(totalLpTokens.value).isZero();
});
</script>

<template>
  <BalCard shadow="xl" exposeOverflow noBorder>
    <template #header>
      <div class="w-full">
        <!-- <div class="text-xs leading-none text-secondary">
          {{ configService.network.chainName }}
        </div> -->
        <div class="flex justify-between items-center">
          <h5 class="text-red-500">Unlock Season 3 Vault</h5>
        </div>
      </div>
    </template>

    <LockedAmount
      :lockablePool="lockablePool"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
      :totalLpTokens="totalLpTokens"
      :fiatTotalLpTokens="fiatTotalLpTokens"
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
        @click="showPreviewModal = true"
      >
        Unlock Season 3 Vault
      </BalBtn>
    </div>
  </BalCard>
  <teleport to="#modal">
    <NewUnlockPreviewModal
      v-if="showPreviewModal"
      :lockablePool="lockablePool"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
      :veBalLockInfo="veBalLockInfo"
      :totalLpTokens="totalLpTokens"
      :fiatTotalLpTokens="fiatTotalLpTokens"
      @close="showPreviewModal = false"
    />
  </teleport>
</template>
