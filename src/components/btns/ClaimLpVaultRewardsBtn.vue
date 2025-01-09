<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { FeeDistributor } from '@/services/balancer/contracts/contracts/fee-distributor';
import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';

import TxActionBtn from './TxActionBtn/TxActionBtn.vue';
import useLpVaultRewardsQuery from '@/composables/queries/useLpVaultRewardsQuery';
import { useTokens } from '@/providers/tokens.provider';

/**
 * TYPES
 */
type Props = {
  tokenAddress?: string;
  pointsAmount: string;
  deprecated?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const { balanceFor } = useTokens();

/**
 * SERVICES
 */

const rewardDistributor = new FeeDistributor(
  configService.network.addresses.rewardDistributor || ''
);

const rewardDistributorV2 = new FeeDistributor(
  configService.network.addresses.rewardDistributorV2 || ''
);

const pointsAddress = configService.network.tokens.Addresses.POINTS || '';

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { fNum } = useNumbers();
const { account } = useWeb3();
const lpVaultRewardsQuery = useLpVaultRewardsQuery();

function onConfirm() {
  lpVaultRewardsQuery.refetch();
  if (configService.network.tokens.Addresses.POINTS) {
    balanceFor(configService.network.tokens.Addresses.POINTS);
  }
}
/**
 * METHODS
 */
function claimTx() {
  if (pointsAddress)
    return rewardDistributor.claimBalance(account.value, pointsAddress);
  return rewardDistributor.claimBalances(account.value);
}

function claimTxV2() {
  if (pointsAddress)
    return rewardDistributorV2.claimBalance(account.value, pointsAddress);
  return rewardDistributorV2.claimBalances(account.value);
}
</script>

<template>
  <TxActionBtn
    v-if="props.deprecated"
    label="Claim S2 Vault Points"
    class="custom-gradient-btn"
    size="sm"
    :actionFn="claimTx"
    :disabled="!pointsAddress || props.pointsAmount === '0'"
    :onConfirmFn="onConfirm"
    action="claim"
    :summary="`${t('claim')} ${fNum(props.pointsAmount, FNumFormats.token)}`"
    :confirmingLabel="$t('claiming')"
    v-bind="$attrs"
  />
  <TxActionBtn
    v-else
    label="Claim S3 Vault Points"
    class="custom-gradient-btn"
    size="sm"
    :actionFn="claimTxV2"
    :disabled="!pointsAddress || props.pointsAmount === '0'"
    :onConfirmFn="onConfirm"
    action="claim"
    :summary="`${t('claim')} ${fNum(props.pointsAmount, FNumFormats.token)}`"
    :confirmingLabel="$t('claiming')"
    v-bind="$attrs"
  />
</template>

<style scoped>
.custom-gradient-btn {
  background: linear-gradient(to right, #916f2d, #d4af37, #aa8a3b);
  background-size: 200% 100%;
  color: #fff;
  text-shadow: 0 0 2px rgb(0 0 0 / 50%);
  transition: all 0.5s ease;
}

.custom-gradient-btn:hover {
  background-position: 100% 0;
  box-shadow: 0 0 20px rgb(212 175 55 / 70%);
  animation: shimmer 3s infinite linear;
}

.custom-gradient-btn:disabled {
  background: #8a8a8a;
  color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  animation: none;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
