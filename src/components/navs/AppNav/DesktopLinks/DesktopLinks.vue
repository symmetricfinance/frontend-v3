<script lang="ts" setup>
import { useRoute } from 'vue-router';
import DesktopLinkItem from './DesktopLinkItem.vue';
import useNetwork, { isTestnet, veSymbol } from '@/composables/useNetwork';
import { Goals, trackGoal } from '@/composables/useFathom';
import { isVeBalSupported, isGaugesSupported } from '@/composables/useVeBAL';
import { configService } from '@/services/config/config.service';

/**
 * COMPOSABLES
 */
const route = useRoute();
const { networkSlug } = useNetwork();

const isPointsSupported = computed(
  () => configService.network.pools.PointsGauges
);
console.log('isPointsSupported', isPointsSupported);

/**
 * METHODS
 */
function isActive(page: string): boolean {
  if (route.name === page) return true;
  return false;
}
</script>

<template>
  <div class="desktop-links">
    <DesktopLinkItem
      :to="{ name: 'home', params: { networkSlug } }"
      :active="isActive('home')"
      prefetch
      @click="trackGoal(Goals.ClickNavPools)"
    >
      {{ $t('pool') }}
    </DesktopLinkItem>
    <DesktopLinkItem
      :to="{ name: 'swap', params: { networkSlug } }"
      :active="isActive('swap')"
      prefetch
      @click="trackGoal(Goals.ClickNavSwap)"
    >
      {{ $t('swap') }}
    </DesktopLinkItem>
    <DesktopLinkItem
      v-if="isGaugesSupported"
      :to="{ name: 'claim', params: { networkSlug } }"
      :active="isActive('claim')"
      prefetch
      @click="trackGoal(Goals.ClickNavClaim)"
    >
      <div class="flex items-center">
        {{ $t('claim') }}
      </div>
    </DesktopLinkItem>
    <DesktopLinkItem
      v-if="isTestnet"
      :to="{ name: 'faucet', params: { networkSlug } }"
      :active="isActive('faucet')"
    >
      Faucet
    </DesktopLinkItem>
    <DesktopLinkItem
      :to="{ name: 'portfolio', params: { networkSlug } }"
      :active="isActive('portfolio')"
      prefetch
      @click="trackGoal(Goals.ClickNavPortfolio)"
    >
      {{ $t('portfolio') }}
    </DesktopLinkItem>
    <DesktopLinkItem
      v-if="isVeBalSupported"
      :to="{ name: 'vesymm', params: { networkSlug } }"
      :active="isActive('vesymm')"
      prefetch
      @click="trackGoal(Goals.ClickNavVebal)"
    >
      {{ veSymbol }}
    </DesktopLinkItem>
    <DesktopLinkItem
      v-if="isPointsSupported"
      :to="{ name: 'symm-points', params: { networkSlug } }"
      :active="isActive('symm-points')"
      prefetch
      @click="trackGoal(Goals.ClickNavPoints)"
    >
      <span
        class="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500"
        >SYMM Points</span
      >
    </DesktopLinkItem>
    <!-- <DesktopLinkItem
      v-if="isVeBalSupported"
      :to="{ name: 'airdrop', params: { networkSlug } }"
      :active="isActive('airdrop')"
      prefetch
      @click="trackGoal(Goals.ClickNavVebal)"
    >
      Airdrop
    </DesktopLinkItem> -->
  </div>
</template>

<style scoped>
.desktop-links {
  @apply grid gap-6 grid-flow-col grid-rows-1 h-full content-center;
}
</style>
