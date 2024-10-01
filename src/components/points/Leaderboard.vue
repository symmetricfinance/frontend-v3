<script lang="ts" setup>
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { ColumnDefinition } from '@/components/_global/BalTable/types';
import { shortenLabel } from '@/lib/utils';
interface LeaderboardEntry {
  id: string;
  address: string;
  balance: string;
  points: string;
}

type Props = {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
};

const props = defineProps<Props>();
const { fNum } = useNumbers();

function shortenIf0x(address: string) {
  if (address.startsWith('0x') && address.length === 42) {
    return shortenLabel(address);
  }
  return address;
}

const columns = ref<ColumnDefinition<LeaderboardEntry>[]>([
  {
    name: 'User',
    id: 'address',
    width: 200,
    accessor: 'address',
    isSortable: false,
    Cell: 'userColumnCell',
  },
  {
    name: 'Points',
    id: 'amount',
    align: 'right',
    width: 200,
    accessor: ({ points }) => `${fNum(points, FNumFormats.token)} Points`,
    isSortable: false,
  },
]);
</script>
<template>
  <div class="container">
    <div class="mb-4 ml-2 text-xl font-bold">Leaderboard</div>
    <BalTable
      :isLoading="props.isLoading"
      :columns="columns"
      :data="props.leaderboard"
    >
      <template #userColumnCell="{ address }">
        <div class="pl-6 text-left">
          {{ shortenIf0x(address) }}
        </div>
      </template>
    </BalTable>
  </div>
</template>s