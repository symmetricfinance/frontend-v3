<script setup lang="ts">
import { computed } from 'vue';

import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import { useLock } from '@/composables/useLock';
import { VeBalLockInfo } from '@/services/balancer/contracts/contracts/veBAL';
import { Pool } from '@/services/pool/types';
import { veSymbol } from '@/composables/useNetwork';

/**
 * PROPS
 */
type Props = {
  lockPool: Pool;
  lock?: VeBalLockInfo;
};
const props = defineProps<Props>();

/** COMPOSABLES */
const { totalLockedShares } = useLock();

function proxyToObject(proxy) {
  const obj = JSON.parse(JSON.stringify(proxy));
  for (const key of Object.keys(obj)) {
    if (obj[key] instanceof Object) {
      obj[key] = proxyToObject(obj[key]);
    }
  }
  return obj;
}

/** COMPUTED */
const lockPools = computed<Pool[]>(() => {
  if (props.lockPool) {
    const pool = proxyToObject({
      ...props.lockPool,
      lockedEndDate:
        props.lock?.hasExistingLock && !props.lock?.isExpired
          ? props.lock?.lockedEndDate
          : undefined,
    });
    if (pool.apr && props.lock?.hasExistingLock && !props.lock?.isExpired) {
      const currentTime = Math.floor(Date.now() / 1000); // Get current Unix timestamp
      const startOfWeek = roundDownToThursday(currentTime); // Round down to start of the week (Thursday midnight UTC)
      const oneYearLater = currentTime + 60 * 60 * 24 * 365; // Add one year to the current time
      const maxLockTime = roundDownToThursday(oneYearLater); // Round down to start of the week (Thursday midnight UTC) one year later

      pool.apr.max = pool.apr.max
        ? (Math.floor(props.lock?.lockedEndDate / 1000 - startOfWeek) /
            (maxLockTime - startOfWeek)) *
          pool.apr.max
        : 0;
    }
    return [pool];
  }
  return [];
});

function roundDownToThursday(timestamp: number): number {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  const day = date.getUTCDay(); // Get the day of the week (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
  const daysToThursday = (day + 7 - 4) % 7; // Calculate the number of days to Thursday (4 - Thursday)
  date.setUTCDate(date.getUTCDate() - daysToThursday); // Subtract the number of days to Thursday
  date.setUTCHours(0, 0, 0, 0); // Set the time to midnight (00:00:00)
  return Math.floor(date.getTime() / 1000); // Convert back to Unix timestamp in seconds
}

const poolShares = computed(
  (): Record<string, string> => ({
    [props.lockPool.id]: totalLockedShares.value,
  })
);

const poolsToRenderKey = computed(() => JSON.stringify(lockPools.value));

const hiddenColumns = ['poolVolume', 'migrate', 'actions', 'myBoost'];
</script>

<template>
  <div>
    <BalStack vertical spacing="sm">
      <h5 class="px-4 xl:px-0">
        {{ $t('veBalProtocolLiquidity', { veSymbol }) }}
      </h5>
      <PoolsTable
        :key="poolsToRenderKey"
        :data="lockPools"
        :shares="poolShares"
        :hiddenColumns="hiddenColumns"
        sortColumn="myBalance"
        showPoolShares
      />
    </BalStack>
  </div>
</template>
