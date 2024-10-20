// import { EthereumTransactionData } from 'bnc-sdk/dist/types/src/interfaces';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { BLOCKED_ADDRESSES } from '@/constants/blocked';
import { includesAddress } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';

import useAlerts, { AlertPriority, AlertType } from '../useAlerts';
// import useBlocknative from '../useBlocknative';
// import { useTokens } from '@/providers/tokens.provider';
import useTransactions from '../useTransactions';

import { isLikelyInUK } from '@/services/location/location.service';

export default function useWeb3Watchers() {
  // COMPOSABLES
  const { t } = useI18n();
  const router = useRouter(); // Add this line
  // const { blocknative, supportsBlocknative } = useBlocknative();
  const {
    appNetworkConfig,
    chainId,
    account,
    isMismatchedNetwork,
    isUnsupportedNetwork,
    blockNumber,
    connectToAppNetwork,
    isWalletReady,
    disconnectWallet,
    isSubgraphUnsynced,
  } = useWeb3();
  const { addAlert, removeAlert } = useAlerts();
  // const { refetchBalances, refetchAllowances } = useTokens();
  const { handlePendingTransactions } = useTransactions();

  // function handleTransactionReplacement(
  //   tx: EthereumTransactionData,
  //   replacementReason: ReplacementReason
  // ) {
  //   const originalHash = tx.replaceHash;

  //   if (originalHash != null) {
  //     updateTransaction(originalHash, 'tx', {
  //       // new id
  //       id: tx.hash,
  //       replacementReason,
  //     });
  //   }
  // }

  async function checkIfSubgraphIsUnsynced() {
    const isUnsynced = await isSubgraphUnsynced();
    if (isUnsynced) {
      addAlert({
        id: 'subgraph-unsynced',
        label: t('subgraphUnsynced'),
        type: AlertType.ERROR,
        persistent: true,
        action: undefined,
        actionLabel: undefined,
        priority: AlertPriority.HIGH,
      });
    } else {
      removeAlert('subgraph-unsynced');
    }
  }

  function checkIsUnsupportedNetwork() {
    if (
      chainId.value &&
      (isUnsupportedNetwork.value || isMismatchedNetwork.value)
    ) {
      addAlert({
        id: 'network-mismatch',
        label: t('networkMismatch', [appNetworkConfig.name]),
        type: AlertType.ERROR,
        persistent: true,
        action: connectToAppNetwork,
        actionLabel: t('switchNetwork'),
        priority: AlertPriority.HIGH,
      });
    } else {
      removeAlert('network-mismatch');
    }
  }

  // Add this new function
  function checkUserLocation() {
    if (isLikelyInUK()) {
      addAlert({
        id: 'uk-disclaimer',
        label: t('ukDisclaimer'),
        type: AlertType.INFO,
        persistent: true,
        action: () => router.push('/uk-disclaimer'),
        actionLabel: t('viewUkDisclaimer'),
        priority: AlertPriority.MEDIUM,
      });
    } else {
      removeAlert('uk-disclaimer');
    }
  }

  // Watch for user account change:
  // -> Unsubscribe Blocknative from old account if exits
  // -> Listen to new account for transactions and update balances
  // watch(
  //   () => account.value,
  //   (newAccount, oldAccount) => {
  //     if (supportsBlocknative.value) {
  //       if (oldAccount) blocknative.unsubscribe(oldAccount);
  //       if (!newAccount) return;

  //       const { emitter } = blocknative.account(newAccount);
  //       emitter.on('txConfirmed', () => {
  //         refetchBalances();
  //         refetchAllowances();
  //       });

  //       emitter.on('txSpeedUp', tx =>
  //         handleTransactionReplacement(
  //           tx as EthereumTransactionData,
  //           'txSpeedUp'
  //         )
  //       );

  //       emitter.on('txCancel', tx =>
  //         handleTransactionReplacement(
  //           tx as EthereumTransactionData,
  //           'txCancel'
  //         )
  //       );
  //     }
  //   }
  // );

  // Watch for user network switch
  // -> Display alert message if unsupported or not the same as app network.
  watch(chainId, () => {
    checkIsUnsupportedNetwork();
  });

  watch(isWalletReady, () => {
    checkIsUnsupportedNetwork();
    checkIfSubgraphIsUnsynced();
    checkUserLocation(); // Add this line
  });

  watch(blockNumber, async () => {
    if (isWalletReady.value) {
      handlePendingTransactions();
    }
  });

  watch(account, () => {
    if (includesAddress(BLOCKED_ADDRESSES, account.value)) {
      disconnectWallet();
    }
  });
}
