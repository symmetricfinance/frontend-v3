import { ApprovalAction } from '@/composables/approvals/types';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { fiatValueOf } from '@/composables/usePoolHelpers';
import useTransactions from '@/composables/useTransactions';
import { usePoolStaking } from '@/providers/local/pool-staking.provider';
import { useTokens } from '@/providers/tokens.provider';
import { bnum, trackLoading } from '@/lib/utils';
import { AnyPool } from '@/services/pool/types';
import { TransactionActionInfo } from '@/types/transactions';
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/abstract-provider';
import { getAddress } from '@ethersproject/address';
import { useI18n } from 'vue-i18n';
import useTokenApprovalActions from '@/composables/approvals/useTokenApprovalActions';
import { usePoolPointsStaking } from '@/providers/local/pool-points-staking.provider';

/**
 * TYPES
 */
export type StakeAction =
  | 'stake'
  | 'unstake'
  | 'restake'
  | 'stakeForPoints'
  | 'unstakeForPoints';

export type StakePreviewProps = {
  pool: AnyPool;
  action: StakeAction;
};

export function useStakePreview(props: StakePreviewProps, emit) {
  /**
   * STATE
   */
  const isLoadingApprovalsForGauge = ref(false);
  const isActionConfirmed = ref(false);
  const confirmationReceipt = ref<TransactionReceipt>();
  const stakeActions = ref<TransactionActionInfo[]>([]);

  /**
   * COMPOSABLES
   */
  const { balanceFor, refetchBalances } = useTokens();
  const { fNum } = useNumbers();
  const { t } = useI18n();
  const { addTransaction } = useTransactions();
  const { getTokenApprovalActions } = useTokenApprovalActions();
  const {
    isLoading: isPoolStakingLoading,
    stake,
    unstake,
    stakedShares,
    refetchAllPoolStakingData,
    preferentialGaugeAddress,
  } = usePoolStaking();

  const {
    isLoading: isPointsLoading,
    stakeForPoints,
    unstakeForPoints,
    stakedShares: stakedPointsShares,
    refetchAllPoolStakingData: refetchAllPointsStakingData,
    pointsGaugeAddress,
  } = usePoolPointsStaking();

  // Staked or unstaked shares depending on action type.
  let currentShares = '0';

  if (props.action === 'stake' || props.action === 'stakeForPoints') {
    currentShares = balanceFor(getAddress(props.pool.address));
  } else if (props.action === 'unstakeForPoints') {
    currentShares = stakedPointsShares.value;
  } else {
    currentShares = stakedShares.value;
  }

  const stakeAction = {
    label: t('stake'),
    loadingLabel: t('staking.staking'),
    confirmingLabel: t('confirming'),
    action: () => txWithNotification(stake, 'stake'),
    stepTooltip: t('staking.stakeTooltip'),
  };

  const unstakeAction = {
    label: t('unstake'),
    loadingLabel: t('staking.unstaking'),
    confirmingLabel: t('confirming'),
    action: () => txWithNotification(unstake, 'unstake'),
    stepTooltip:
      props.action === 'restake'
        ? t('staking.restakeTooltip')
        : t('staking.unstakeTooltip'),
  };

  const stakeForPointsAction = {
    label: t('stakeForPoints'),
    loadingLabel: t('staking.staking'),
    confirmingLabel: t('confirming'),
    action: () => txWithNotification(stakeForPoints, 'stakeForPoints'),
    stepTooltip: t('staking.stakeTooltip'),
  };

  const unstakeForPointsAction = {
    label: t('unstakeForPoints'),
    loadingLabel: t('staking.unstaking'),
    confirmingLabel: t('confirming'),
    action: () => txWithNotification(unstakeForPoints, 'unstakeForPoints'),
    stepTooltip: t('staking.unstakeTooltip'),
  };

  /**
   * COMPUTED
   */
  const isStakeAndZero = computed(
    () =>
      props.action === 'stake' &&
      (currentShares === '0' || currentShares === '')
  );

  const totalUserPoolSharePct = ref(
    bnum(
      bnum(stakedShares.value).plus(balanceFor(getAddress(props.pool.address)))
    )
      .div(props.pool.totalShares)
      .toString()
  );

  const amountsToApprove = computed(() => [
    {
      address: props.pool.address,
      amount: currentShares,
    },
  ]);

  const isLoading = computed(() => {
    if (
      props.action === 'stakeForPoints' ||
      props.action === 'unstakeForPoints'
    ) {
      return isLoadingApprovalsForGauge.value || isPointsLoading.value;
    }
    return isLoadingApprovalsForGauge.value || isPoolStakingLoading.value;
  });

  /**
   * METHODS
   */
  async function txWithNotification(
    action: () => Promise<TransactionResponse>,
    actionType: StakeAction
  ) {
    try {
      const tx = await action();
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: actionType,
        summary: t(`transactionSummary.${actionType}`, {
          pool: props.pool.symbol,
          amount: fNum(
            fiatValueOf(props.pool, currentShares),
            FNumFormats.fiat
          ),
        }),
        details: {
          total: fNum(fiatValueOf(props.pool, currentShares), FNumFormats.fiat),
          pool: props.pool,
        },
      });
      return tx;
    } catch (error) {
      throw new Error(`Failed create ${actionType} transaction`, {
        cause: error,
      });
    }
  }

  async function loadApprovalsForGauge() {
    const approvalActions = await trackLoading(async () => {
      if (!preferentialGaugeAddress.value) return;

      return await getTokenApprovalActions({
        amountsToApprove: amountsToApprove.value,
        spender: preferentialGaugeAddress.value,
        actionType: ApprovalAction.Staking,
      });
    }, isLoadingApprovalsForGauge);

    if (approvalActions) stakeActions.value.unshift(...approvalActions);
  }

  async function loadApprovalsForPointsGauge() {
    const approvalActions = await trackLoading(async () => {
      if (!pointsGaugeAddress.value) return;

      return await getTokenApprovalActions({
        amountsToApprove: amountsToApprove.value,
        spender: pointsGaugeAddress.value,
        actionType: ApprovalAction.Staking,
      });
    }, isLoadingApprovalsForGauge);

    if (approvalActions) stakeActions.value.unshift(...approvalActions);
  }

  async function handleSuccess(receipt: TransactionReceipt) {
    isActionConfirmed.value = true;
    confirmationReceipt.value = receipt;
    if (
      props.action === 'unstakeForPoints' ||
      props.action === 'stakeForPoints'
    ) {
      await Promise.all([refetchBalances(), refetchAllPointsStakingData()]);
    } else {
      await Promise.all([refetchBalances(), refetchAllPoolStakingData()]);
    }
    emit('success');
  }

  function handleClose() {
    isActionConfirmed.value = false;
    confirmationReceipt.value = undefined;
    emit('close');
  }

  /**
   * WATCHERS
   */
  watch(
    () => props.action,
    () => {
      if (props.action === 'stake') stakeActions.value = [stakeAction];
      if (props.action === 'unstake') {
        stakeActions.value = [unstakeAction];
      }
      if (props.action === 'stakeForPoints') {
        stakeActions.value = [stakeForPointsAction];
      }
      if (props.action === 'unstakeForPoints') {
        stakeActions.value = [unstakeForPointsAction];
      }
      if (props.action === 'restake')
        stakeActions.value = [unstakeAction, stakeAction];
    },
    { immediate: true }
  );

  watch(preferentialGaugeAddress, async () => {
    if (props.action !== 'unstake' && props.action !== 'unstakeForPoints')
      return;
    await loadApprovalsForGauge();
  });

  watch(pointsGaugeAddress, async () => {
    if (props.action !== 'stakeForPoints') return;
    await loadApprovalsForPointsGauge();
  });

  /**
   * LIFECYCLE
   */
  onBeforeMount(async () => {
    if (props.action === 'stakeForPoints') {
      await loadApprovalsForPointsGauge();
    } else if (props.action !== 'unstake') {
      await loadApprovalsForGauge();
    }
  });

  return {
    //state
    isActionConfirmed,
    confirmationReceipt,
    isLoading,
    currentShares,
    stakeActions,
    totalUserPoolSharePct,
    //methods
    handleSuccess,
    handleClose,
    isStakeAndZero,
  };
}
