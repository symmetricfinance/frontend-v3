<script lang="ts" setup>
import LockForm from '@/components/forms/lock_actions/LPVaultLockForm/LockForm.vue';
</script>
<template>
  <LockForm v-if="true" />
  <div v-else class="text-center">
    <div class="text-lg font-semibold">
      {{ $t('veBAL.notSupported.title') }}
    </div>
    <div>{{ $t('veBAL.notSupported.description') }}</div>
  </div>
</template>
