<script setup lang="ts">
import { computed, onBeforeMount, ref, toRef, watch } from 'vue';

import WrapStEthLink from '@/components/contextual/pages/pool/add-liquidity/WrapStEthLink.vue';
import StakePreviewModal from '@/components/contextual/pages/pool/staking/StakePreviewModal.vue';
import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';
import { tokenWeight, usePoolHelpers } from '@/composables/usePoolHelpers';
import { LOW_LIQUIDITY_THRESHOLD } from '@/constants/poolLiquidity';
import { bnum, includesAddress, isSameAddress } from '@/lib/utils';
import { isRequired } from '@/lib/utils/validations';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import useVeBal from '@/composables/useVeBAL';

import AddLiquidityPreview from './components/AddLiquidityPreview/AddLiquidityPreview.vue';
import AddLiquidityTotals from './components/AddLiquidityTotals.vue';

import MissingPoolTokensAlert from './components/MissingPoolTokensAlert.vue';
import { useTokens } from '@/providers/tokens.provider';
import { isEqual } from 'lodash';
import { useJoinPool } from '@/providers/local/join-pool.provider';
import { useUserTokens } from '@/providers/local/user-tokens.provider';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

/**
 * STATE
 */
const showPreview = ref(false);
const showStakeModal = ref(false);
const showStakePointsModal = ref(false);

/**
 * COMPOSABLES
 */
const {
  managedPoolWithSwappingHalted,
  isDeepPool,
  isPreMintedBptPool,
  poolJoinTokens,
} = usePoolHelpers(toRef(props, 'pool'));
const { veBalTokenInfo } = useVeBal();
const { isWalletReady, startConnectWithInjectedProvider, isMismatchedNetwork } =
  useWeb3();
const { wrappedNativeAsset, nativeAsset, getToken } = useTokens();
const {
  isLoadingQuery,
  isSingleAssetJoin,
  amountsIn,
  highPriceImpact,
  highPriceImpactAccepted,
  hasValidInputs,
  hasAmountsIn,
  queryError,
  setTokensIn,
} = useJoinPool();

const { tokensWithBalance } = useUserTokens();

/**
 * COMPUTED
 */
const forceProportionalInputs = computed(
  (): boolean => managedPoolWithSwappingHalted.value
);

const poolHasLowLiquidity = computed((): boolean =>
  bnum(props.pool.totalLiquidity).lt(LOW_LIQUIDITY_THRESHOLD)
);

const excludedTokens = computed((): string[] => {
  const tokens = [props.pool.address];
  if (veBalTokenInfo.value) {
    tokens.unshift(veBalTokenInfo.value.address);
  }
  return tokens;
});

const joinTokensWithBalance = computed<string[]>(() => {
  let shouldAddNativeAsset = false;
  const joinTokens = poolJoinTokens.value.filter(address => {
    // If it's the wrapped native asset address
    if (address && isSameAddress(address, wrappedNativeAsset.value.address)) {
      // Check if user has wrapped token balance
      const hasWrappedBalance = includesAddress(
        tokensWithBalance.value,
        wrappedNativeAsset.value.address
      );
      // If no wrapped balance, replace with native token
      if (!hasWrappedBalance) {
        shouldAddNativeAsset = true;
        return false;
      }
      return true;
    }
    // For other tokens, check if user has balance
    return address ? includesAddress(tokensWithBalance.value, address) : false;
  });
  if (shouldAddNativeAsset) {
    joinTokens.push(nativeAsset.address);
  }
  return joinTokens;
});

const joinTokensWithoutBalance = computed<string[]>(() =>
  poolJoinTokens.value.filter(
    address => !includesAddress(tokensWithBalance.value, address)
  )
);

async function initializeTokensForm(isSingleAssetJoin: boolean) {
  if (isSingleAssetJoin) {
    // Single asset joins are only relevant for Composable pools where swap
    // joins are possible. In this case we want to default to the wrapped native
    // asset.
    setTokensIn([wrappedNativeAsset.value.address]);
  } else {
    setTokensIn(joinTokensWithBalance.value);
  }
}

function getTokenInputLabel(address: string): string | undefined {
  const token = getToken(address);
  return token?.symbol;
}

/**
 * If the address is the wrapped native asset, we want to give the option to use
 * the native asset instead.
 */
function tokenOptions(address: string): string[] {
  if (isSingleAssetJoin.value) return [];

  return includesAddress(
    [wrappedNativeAsset.value.address, nativeAsset.address],
    address
  )
    ? [nativeAsset.address, wrappedNativeAsset.value.address]
    : [];
}

/**
 * When changing tokens, clear the amount value
 */
function onTokenChange() {
  if (isSingleAssetJoin.value && amountsIn.value.length > 0) {
    amountsIn.value[0].value = '';
  }
}

/**
 * CALLBACKS
 */
onBeforeMount(() => {
  initializeTokensForm(isSingleAssetJoin.value);
});

/**
 * WATCHERS
 */
watch(
  [isSingleAssetJoin, joinTokensWithBalance],
  (
    [isSingleAsset, newJoinTokensWithBalance],
    [prevIsSingleAsset, prevJoinTokensWithBalance]
  ) => {
    // Initialize token form if token balances change (ie. After investing, transaction confirmed or when account changes)
    // only if preview modal is not open
    if (!showPreview.value) {
      const hasTabChanged = prevIsSingleAsset !== isSingleAsset;
      const hasUserTokensChanged = !isEqual(
        prevJoinTokensWithBalance,
        newJoinTokensWithBalance
      );
      if (hasUserTokensChanged || hasTabChanged) {
        initializeTokensForm(isSingleAsset);
      }
    }
  }
);
</script>

<template>
  <div data-testid="add-liquidity-form">
    <BalAlert
      v-if="forceProportionalInputs"
      type="warning"
      :title="$t('investment.warning.managedPoolSwappingHalted.title')"
      :description="
        $t('investment.warning.managedPoolSwappingHalted.description')
      "
      class="mb-5"
    />

    <BalAlert
      v-if="poolHasLowLiquidity"
      type="warning"
      :title="$t('investment.warning.lowLiquidity.title')"
      :description="$t('investment.warning.lowLiquidity.description')"
      class="mb-5"
    />

    <TokenInput
      v-for="amountIn in amountsIn"
      :key="amountIn.address"
      v-model:isValid="amountIn.valid"
      v-model:address="amountIn.address"
      v-model:amount="amountIn.value"
      :name="amountIn.address"
      :weight="tokenWeight(pool, amountIn.address)"
      :options="tokenOptions(amountIn.address)"
      :aria-label="'Amount of: ' + getTokenInputLabel(amountIn.address)"
      class="mb-4"
      :fixedToken="!isSingleAssetJoin"
      :excludedTokens="excludedTokens"
      @update:address="onTokenChange"
    />

    <MissingPoolTokensAlert
      v-if="!isSingleAssetJoin"
      :showSingleTokenSuggestion="isDeepPool && isPreMintedBptPool"
      :poolTokensWithBalance="joinTokensWithBalance"
      :poolTokensWithoutBalance="joinTokensWithoutBalance"
    />

    <AddLiquidityTotals :pool="pool" />

    <div
      v-if="highPriceImpact"
      class="p-2 pb-2 mt-5 rounded-lg border dark:border-gray-700 high-price-impact"
    >
      <BalCheckbox
        v-model="highPriceImpactAccepted"
        :rules="[isRequired($t('priceImpactCheckbox'))]"
        name="highPriceImpactAccepted"
        size="sm"
        :label="$t('priceImpactAccept', [$t('depositing')])"
      />
    </div>

    <WrapStEthLink :pool="pool" class="mt-5" />

    <BalAlert
      v-if="queryError"
      type="error"
      :title="$t('thereWasAnError')"
      :description="queryError"
      class="mt-4"
      block
    />

    <div class="mt-4">
      <BalBtn
        v-if="!isWalletReady"
        :label="$t('connectWallet')"
        color="gradient"
        block
        @click="startConnectWithInjectedProvider"
      />
      <BalBtn
        v-else
        :label="$t('preview')"
        color="gradient"
        :disabled="
          !hasAmountsIn ||
          !hasValidInputs ||
          isMismatchedNetwork ||
          isLoadingQuery ||
          !!queryError
        "
        block
        @click="showPreview = true"
      />
    </div>

    <teleport to="#modal">
      <AddLiquidityPreview
        v-if="showPreview"
        :pool="pool"
        @close="showPreview = false"
        @show-stake-modal="showStakeModal = true"
        @show-stake-points-modal="showStakePointsModal = true"
      />
      <StakePreviewModal
        :pool="pool"
        :isVisible="showStakeModal"
        action="stake"
        @close="showStakeModal = false"
      />
      <StakePreviewModal
        :pool="pool"
        :isVisible="showStakePointsModal"
        action="stakeForPoints"
        @close="showStakePointsModal = false"
      />
    </teleport>
  </div>
</template>

<style scoped>
.high-price-impact:has(.bal-checkbox-error) {
  @apply border-red-500 bg-red-50 dark:bg-red-500 bg-opacity-50 dark:bg-opacity-5 transition-colors;
}
</style>
