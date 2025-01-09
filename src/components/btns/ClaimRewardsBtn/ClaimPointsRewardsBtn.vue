<script lang="ts" setup>
import { getAddress } from '@ethersproject/address';
import { useI18n } from 'vue-i18n';
import useNumbers from '@/composables/useNumbers';
import { LiquidityGaugeRewardsHelper } from '@/services/balancer/contracts/contracts/gauge-reward-helper';

import TxActionBtn from '../TxActionBtn/TxActionBtn.vue';
import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';
import usePointsGaugesDecorationQuery from '@/composables/queries/usePointsGaugesDecorationQuery';
import { useTokens } from '@/providers/tokens.provider';

/**
 * TYPES
 */
type Props = {
  gauges: string[];
  totalAmount: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const { balanceFor } = useTokens();

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { fNum } = useNumbers();
const { account } = useWeb3();
const gaugesQuery = usePointsGaugesDecorationQuery();

/**
 * STATE
 */
const gaugeAddresses = props.gauges.map(getAddress);

/**
 * METHODS
 */
function claimTx() {
  const liquidityGaugeRewardsHelperContract = new LiquidityGaugeRewardsHelper(
    configService.network.addresses.gaugeRewardsHelper || ''
  );
  return liquidityGaugeRewardsHelperContract.claimRewardsForGauges(
    gaugeAddresses,
    account.value
  );
}

function onConfirm() {
  gaugesQuery.refetch();
  if (configService.network.tokens.Addresses.POINTS) {
    balanceFor(configService.network.tokens.Addresses.POINTS);
  }
}
</script>

<template>
  <TxActionBtn
    :label="t('claim')"
    color="gradient"
    size="sm"
    :actionFn="claimTx"
    :onConfirmFn="onConfirm"
    action="claim"
    :disabled="totalAmount === '0'"
    :summary="`${t('claim')} ${fNum(totalAmount)} points}`"
    :confirmingLabel="t('claiming')"
  />
</template>
