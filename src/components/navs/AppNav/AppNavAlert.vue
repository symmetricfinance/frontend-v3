<template>
  <div
    role="alert"
    aria-live="polite"
    :class="['app-nav-alert', classes]"
    @click="handleClick"
  >
    <div
      :class="[
        'flex flex-1 md:justify-center fade-in-slow',
        { 'flex-col items-center': isInfoType },
      ]"
    >
      <BalIcon
        v-if="iconName"
        :name="iconName"
        :class="{ 'mr-3': !isInfoType, 'mb-2': isInfoType }"
      />
      <div :class="{ 'text-center': isInfoType }">
        <p class="alert-label">
          {{ alert.label }}
          <a
            v-if="isInfoType && alert.action && alert.actionLabel"
            href="#"
            class="ml-1 underline"
            @click.prevent="alert.action"
            >{{ alert.actionLabel }}</a
          >
        </p>
        <BalBtn
          v-if="!isInfoType && alert.action && alert.actionLabel"
          class="cursor-pointer"
          color="white"
          size="xs"
          :label="alert.actionLabel"
          @click="alert.action"
        />
      </div>
    </div>

    <div v-if="!alert.persistent" class="flex items-start">
      <BalIcon
        name="x"
        class="mt-0.5 cursor-pointer fade-in-slow"
        @click.stop="handleClose"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import useAlerts, { Alert, AlertType } from '@/composables/useAlerts';

export default defineComponent({
  props: {
    alert: { type: Object as PropType<Alert>, required: true },
  },

  setup(props) {
    const { removeAlert } = useAlerts();

    const colorClass = computed(() => {
      switch (props.alert.type) {
        case AlertType.ERROR:
          return 'bg-red-500 text-white';
        case AlertType.FEATURE:
          return 'bg-orange-300 text-black';
        default:
          return 'bg-black text-white';
      }
    });

    const iconName = computed(() => {
      switch (props.alert.type) {
        case AlertType.ERROR:
          return 'alert-triangle';
        default:
          return null;
      }
    });

    const isInfoType = computed(() => props.alert.type === AlertType.INFO);

    const classes = computed(() => {
      return {
        [colorClass.value]: true,
        'cursor-pointer': props.alert.actionOnClick,
        'items-center': isInfoType.value,
      };
    });

    function handleClose() {
      removeAlert(props.alert.id);
    }

    function handleClick() {
      if (props.alert.actionOnClick && props.alert.action) {
        props.alert.action();
      }
    }

    return { classes, iconName, handleClose, handleClick, isInfoType };
  },
});
</script>

<style>
.app-nav-alert {
  @apply flex content-start justify-between py-2 xs:py-4 px-4;

  min-height: 54px;
}

.alert-label {
  @apply font-medium pb-1 block md:inline pr-4;
}

.alert-label a {
  @apply text-white font-bold;
}
</style>
