<script lang="ts" setup>
// import { useI18n } from 'vue-i18n';

// import useNumbers, { FNumFormats } from '@/composables/useNumbers';
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
  futurePoints: string;
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

const pointsAddress = configService.network.tokens.Addresses.POINTS || '';

/**
 * COMPOSABLES
 */
// const { t } = useI18n();
// const { fNum } = useNumbers();
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
function checkpointTx() {
  return rewardDistributor.checkpointUser(account.value);
}
</script>

<template>
  <TxActionBtn
    label="Checkpoint"
    class="custom-gradient-btn checkpoint-btn"
    size="xs"
    :actionFn="checkpointTx"
    :disabled="!pointsAddress || props.futurePoints !== '0'"
    :onConfirmFn="onConfirm"
    action="checkpoint"
    summary="Checkpoint"
    confirmingLabel="Checkpointing"
    v-bind="$attrs"
  />
</template>

<style scoped>
.custom-gradient-btn {
  background-color: #000;
  color: #fff;
  border: 2px solid #ff1493; /* Dark pink outline */
  transition: all 0.3s ease;
}

.custom-gradient-btn:hover {
  background-color: #ff1493; /* Dark pink background on hover */
  color: #fff;
}

.custom-gradient-btn:disabled {
  background-color: #333;
  color: #666;
  border-color: #666;
  cursor: not-allowed;
}

.checkpoint-btn {
  padding: 4px 8px;
  font-size: 0.75rem;
  line-height: 1;
}
</style>
