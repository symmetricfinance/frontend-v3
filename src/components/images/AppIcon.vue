<script lang="ts" setup>
import { computed } from 'vue';

import useDarkMode from '@/composables/useDarkMode';
import useNetwork from '@/composables/useNetwork';

/**
 * TYPES
 */
type Props = {
  forceDark?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  forceDark: false,
});

/**
 * COMPOSABLES
 */
const { darkMode } = useDarkMode();

const { networkSlug } = useNetwork();

const logo = computed(() => {
  return `/images/logos/${networkSlug}-logo.svg`;
});

// const slug = useNetwork().networkSlug;

/**
 * COMPUTED
 */
const useDarkLogo = computed(() => (props.forceDark ? true : darkMode.value));
</script>

<template>
  <img v-if="useDarkLogo" :src="logo" width="30" class="mr-2" />
  <img v-else :src="logo" width="30" class="mr-2" />
</template>
