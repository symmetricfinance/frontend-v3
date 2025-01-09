<script lang="ts" setup>
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { shortenLabel } from '@/lib/utils';

interface LeaderboardEntry {
  id: string;
  address: string | null;
  balance: string;
  points: string;
}

type Props = {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
};

const props = defineProps<Props>();
const { fNum } = useNumbers();

function shortenIf0x(address: string | null) {
  if (!address) return '';
  if (address.startsWith('0x') && address.length === 42) {
    return shortenLabel(address);
  }
  return address;
}

function getRankEmoji(index: number): string {
  switch (index) {
    case 0:
      return '🥇';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return '';
  }
}
</script>

<template>
  <div class="container p-4 bg-gray-850 rounded-lg">
    <div class="mb-4 ml-2 text-xl font-bold">Leaderboard</div>
    <hr class="mb-4 border-t border-gray-900" />
    <div v-if="props.isLoading" class="py-4 text-center">Loading...</div>
    <table v-else class="w-full">
      <thead>
        <tr class="text-left">
          <th class="py-2 px-4 w-16">#</th>
          <th class="py-2 px-4">User</th>
          <th class="py-2 px-4 text-right">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in props.leaderboard" :key="entry.id">
          <td class="py-2 px-4">
            <div class="flex items-center">
              <span class="inline-block text-right">{{ index + 1 }}</span>
              <span class="ml-1 w-6">{{ getRankEmoji(index) }}</span>
            </div>
          </td>
          <td class="py-2 px-4">
            {{ shortenIf0x(entry.address || entry.id) }}
          </td>
          <td class="py-2 px-4 text-right">
            {{ fNum(entry.points, FNumFormats.token) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

th {
  font-weight: bold;
  color: #888;
}

tbody tr {
  border-top: 1px solid #4a5568; /* Tailwind's gray-700 */
}

tr:hover {
  background-color: rgb(0 0 0 / 5%);
}

tbody tr:first-child {
  border-top: none;
}
</style>