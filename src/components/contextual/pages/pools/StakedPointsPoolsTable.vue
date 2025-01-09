<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import { isPoolBoostsEnabled } from '@/composables/useNetwork';
import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';
import { Pool } from '@/services/pool/types';
import { PoolAction } from './types';
import useStakedSharesQuery from '@/composables/queries/useStakedSharesQuery';
import { GaugeShare } from '@/composables/queries/useUserGaugeSharesQuery';
import usePoolsQuery from '@/composables/queries/usePoolsQuery';
import { getAddressFromPoolId } from '@/lib/utils';

const defaultPoolActions = [PoolAction.Add];

/**
 * COMPOSABLES
 */
const { isWalletReady, isWalletConnecting } = useWeb3();
const { t } = useI18n();
const networkName = configService.network.shortName;

/**
 * COMPUTED
 */
const noPoolsLabel = computed(() => {
  return isWalletReady.value || isWalletConnecting.value
    ? t('noStakedInvestments', [networkName])
    : t('connectYourWallet');
});

const hiddenColumns = computed(() => {
  const _hiddenColumns = [
    'poolVolume',
    'migrate',
    'lockEndDate',
    'volume',
    'apr',
  ];
  if (!isPoolBoostsEnabled.value) _hiddenColumns.push('myBoost');

  return _hiddenColumns;
});

const poolsToRenderKey = computed(() => JSON.stringify(stakedPools.value));

const pointsGaugeShares = computed((): GaugeShare[] => {
  const pointsGauges = configService.network.pools.PointsGauges;
  if (pointsGauges) {
    return Object.entries(pointsGauges).map(([poolId, gauge]) => {
      return {
        balance: '0',
        gauge: {
          id: gauge.gauge,
          poolAddress: getAddressFromPoolId(poolId),
          poolId: poolId,
          totalSupply: '0',
          isPreferentialGauge: true,
          isKilled: false,
        },
      };
    });
  }
  return [];
});

const { data: _stakedShares } = useStakedSharesQuery(
  ref(pointsGaugeShares.value as GaugeShare[])
);

const stakedShares = computed(() => {
  return Object.fromEntries(
    Object.entries(_stakedShares?.value || {}).filter(([, balance]) => {
      return Number(balance) > 0;
    })
  );
});

const stakedPoolIds = computed(() => {
  console.log('stakedShares.value', stakedShares.value);
  if (stakedShares.value) {
    return Object.keys(stakedShares.value);
  }
  return [];
});

const isPoolsQueryEnabled = computed(
  (): boolean => stakedPoolIds.value.length > 0
);

const filterOptions = computed(() => ({
  poolIds: stakedPoolIds.value,
  pageSize: 999,
}));

const stakedPoolsQuery = usePoolsQuery(filterOptions, {
  enabled: isPoolsQueryEnabled,
});

const { data: _stakedPools, isLoading } = stakedPoolsQuery;

// Pool records for all the pools where a user has staked BPT.
const stakedPools = computed(
  (): Pool[] => _stakedPools.value?.pages[0].pools || []
);
</script>

<template>
  <div>
    <BalStack vertical spacing="sm">
      <h5 class="px-4 xl:px-0">
        {{ $t('staking.stakedLiquidity') }}
      </h5>
      <PoolsTable
        :key="poolsToRenderKey"
        :isLoading="isWalletReady && isLoading"
        :data="stakedPools"
        :shares="stakedShares"
        :noPoolsLabel="noPoolsLabel"
        sortColumn="myBalance"
        :hiddenColumns="hiddenColumns"
        :defaultPoolActions="defaultPoolActions"
        showPoolShares
        showActions
        showStakeActions
      />
    </BalStack>
  </div>
</template>
