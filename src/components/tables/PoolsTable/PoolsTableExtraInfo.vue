<script lang="ts" setup>
import {
  isLiquidityBootstrapping,
  isBoosted,
  isPointsEarning,
  isTrailblazerXP,
  protocolsFor,
  isGyro,
} from '@/composables/usePoolHelpers';
import { Pool } from '@/services/pool/types';
import { PoolFeature } from '@/types/pools';
import BalChipNew from '@/components/chips/BalChipNew.vue';
import PoolWarningTooltip from '@/components/pool/PoolWarningTooltip.vue';
import PoolFeatureChip from '@/components/chips/PoolFeatureChip.vue';
import { Protocol } from '@/composables/useProtocols';

type Props = {
  pool: Pool;
};

defineProps<Props>();
</script>

<template>
  <div class="flex items-center">
    <BalTooltip
      v-if="isPointsEarning(pool)"
      :text="$t('pointsTooltip')"
      width="56"
    >
      <template #activator>
        <PoolFeatureChip
          :feature="PoolFeature.Points"
          :protocols="protocolsFor(pool, PoolFeature.Points)"
          class="ml-3"
        />
      </template>
    </BalTooltip>
    <BalTooltip
      v-if="isTrailblazerXP(pool)"
      :text="$t('trailblazersTooltip')"
      width="56"
    >
      <template #activator>
        <!-- <PoolFeatureChip
          :feature="PoolFeature.TBXP"
          :protocols="protocolsFor(pool, PoolFeature.TBXP)"
          class="ml-1"
        /> -->
        <img
          src="@/assets/images/icons/networks/taiko.svg"
          alt="Trailblazer XP"
          class="ml-1 w-6 h-6"
        />
      </template>
    </BalTooltip>

    <BalTooltip v-if="isBoosted(pool)" :text="$t('boostedTooltip')" width="56">
      <template #activator>
        <PoolFeatureChip
          :feature="PoolFeature.Boosted"
          :protocols="protocolsFor(pool, PoolFeature.Boosted)"
          class="ml-1"
        />
      </template>
    </BalTooltip>

    <BalTooltip v-if="isGyro(pool)" :text="$t('clpTooltip')" width="56">
      <template #activator>
        <PoolFeatureChip
          :feature="PoolFeature.CLP"
          :protocols="[Protocol.Gyro]"
          class="ml-1"
        />
      </template>
    </BalTooltip>

    <BalChip
      v-if="isLiquidityBootstrapping(pool.poolType)"
      label="LBP"
      color="amber"
      class="text-xs font-medium"
    />
    <BalChipNew v-else-if="pool?.isNew" class="text-lg font-medium" />

    <PoolWarningTooltip :pool="pool" />
  </div>
</template>
