<script lang="ts" setup>
import { orderBy } from 'lodash';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ColumnDefinition } from '@/components/_global/BalTable/types';

import DripBtn from '@/components/btns/DripBtn/DripBtn.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokenLists } from '@/providers/token-lists.provider';
import { useTokens } from '@/providers/tokens.provider';

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { upToLargeBreakpoint } = useBreakpoints();
const { fNum } = useNumbers();
const { balancerTokenList } = useTokenLists();
const { priceFor, balanceFor } = useTokens();

const tokens = computed(() => {
  const tokensWithValues = Object.values(balancerTokenList.value.tokens)
    .map(token => {
      const balance = balanceFor(token.address);
      const price = priceFor(token.address.toLowerCase());
      const value = Number(balance) * price;
      return {
        ...token,
        price,
        balance,
        value,
      };
    })
    .filter(t => t.address != '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE');
  console.log('tokensWithValues', tokensWithValues);

  return orderBy(tokensWithValues, ['value', 'balance'], ['desc', 'desc']);
});

/**
 * STATE
 */
const columns = ref<ColumnDefinition<any>[]>([
  {
    name: 'Token',
    id: 'token',
    accessor: 'token',
    Cell: 'tokenColumnCell',
    width: 475,
    noGrow: true,
  },
  {
    name: t('balance'),
    id: 'Balance',
    align: 'right',
    width: 150,
    accessor: ({ balance }) => `${fNum(balance, FNumFormats.token)}`,
  },
  // {
  //   name: t('value'),
  //   id: 'value',
  //   align: 'right',
  //   width: 150,
  //   accessor: ({ value }) => fNum(value, FNumFormats.fiat),
  // },
  {
    name: 'Drip',
    id: 'drip',
    align: 'center',
    accessor: 'drip',
    Cell: 'dripColumnCell',
    width: 150,
  },
]);
</script>

<template>
  <BalCard
    shadow="lg"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :columns="columns"
      :data="tokens"
      skeletonClass="h-64"
      :square="upToLargeBreakpoint"
    >
      <template #tokenColumnCell="{ name, logoURI }">
        <div class="flex items-center py-4 px-6">
          <BalAsset :iconURI="logoURI" />
          <span class="ml-2">{{ name }}</span>
        </div>
      </template>
      <template #dripColumnCell="{ address }">
        <div class="flex justify-center py-4 px-2">
          <DripBtn :token="address" />
        </div>
      </template>
    </BalTable>
  </BalCard>
</template>
