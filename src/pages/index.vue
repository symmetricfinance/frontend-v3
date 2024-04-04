<script setup lang="ts">
import { useRouter } from 'vue-router';
import axios from 'axios';

//import HomePageHero from '@/components/heros/HomePageHero.vue';
import TokenSearchInput from '@/components/inputs/TokenSearchInput.vue';
// import FeaturedProtocols from '@/components/sections/FeaturedProtocols.vue';
import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useBreakpoints from '@/composables/useBreakpoints';
import useNetwork from '@/composables/useNetwork';
import usePools from '@/composables/pools/usePools';
import { lsGet, lsSet } from '@/lib/utils';
import LS_KEYS from '@/constants/local-storage.keys';
import { useIntersectionObserver } from '@vueuse/core';
import { PoolType } from '@/services/pool/types';
import PoolFeatureSelect from '@/components/inputs/PoolFeatureSelect.vue';
import { useTokens } from '@/providers/tokens.provider';
import { PoolAttributeFilter, PoolTypeFilter } from '@/types/pools';
import UserInvestedInAffectedPoolAlert from '@/pages/recovery-exit/UserInvestedInAffectedPoolAlert.vue';
import useNumbers from '@/composables/useNumbers';

const { fNum } = useNumbers();
const featuredProtocolsSentinel = ref<HTMLDivElement | null>(null);
const isFeaturedProtocolsVisible = ref(false);
useIntersectionObserver(featuredProtocolsSentinel, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    isFeaturedProtocolsVisible.value = true;
  }
});

/**
 * STATE
 */
const route = useRoute();
const urlSortParam = route.query?.sort as string | undefined;
const initSortCol =
  urlSortParam || lsGet(LS_KEYS.App.PoolSorting) || 'totalLiquidity';
const sortField = ref('totalLiquidity');
const poolTypeFilter = ref<PoolTypeFilter>();
const filterPoolIds = ref<string[]>([]);
const filterPoolTypes = ref<PoolType[]>([]);
const filterPoolAttributes = ref<PoolAttributeFilter[]>([]);

/**
 * COMPOSABLES
 */
const router = useRouter();
const { injectPrices, getToken, tokens } = useTokens();
// const { appNetworkConfig } = useNetwork();
// const isElementSupported = appNetworkConfig.supportsElementPools;
const { selectedTokens, addSelectedToken, removeSelectedToken } =
  usePoolFilters();

const { pools, isLoading, isFetchingNextPage, loadMorePools } = usePools({
  filterTokens: selectedTokens,
  sortField,
  poolIds: filterPoolIds,
  poolTypes: filterPoolTypes,
  poolAttributes: filterPoolAttributes,
});

const { upToSmallBreakpoint } = useBreakpoints();
const { networkSlug, networkConfig } = useNetwork();

const isPaginated = computed(() => pools.value.length >= 10);

const totalLiquidity = computed(() => {
  return pools.value.reduce((total, pool) => {
    return total + Number(pool.totalLiquidity);
  }, 0);
});

const tvl = computed(() => {
  return fNum(totalLiquidity.value, {
    style: 'currency',
    maximumFractionDigits: 0,
  });
});

const volumeSnapshot = computed(() => {
  return pools.value.reduce((total, pool) => {
    return total + Number(pool.volumeSnapshot);
  }, 0);
});

const feesSnapshot = computed(() => {
  return pools.value.reduce((total, pool) => {
    return total + Number(pool.feesSnapshot);
  }, 0);
});

/**
 * METHODS
 */
function navigateToCreatePool() {
  router.push({ name: 'create-pool', params: { networkSlug } });
}

function onColumnSort(columnId: string) {
  sortField.value = columnId;
  lsSet(LS_KEYS.App.PoolSorting, columnId);
}

function updatePoolFilters(feature: PoolTypeFilter | undefined) {
  switch (feature) {
    case PoolTypeFilter.Weighted:
      filterPoolIds.value = [];
      filterPoolTypes.value = [PoolType.Weighted];
      break;
    case PoolTypeFilter.Stable:
      filterPoolIds.value = [];
      filterPoolTypes.value = [
        PoolType.Stable,
        PoolType.StablePhantom,
        PoolType.MetaStable,
        PoolType.ComposableStable,
      ];
      break;
    case PoolTypeFilter.CLP:
      filterPoolIds.value = [];
      filterPoolTypes.value = [PoolType.Gyro2, PoolType.Gyro3, PoolType.GyroE];
      break;
    case PoolTypeFilter.LBP:
      filterPoolIds.value = [];
      filterPoolTypes.value = [PoolType.LiquidityBootstrapping];
      break;
    default:
      filterPoolIds.value = [];
      filterPoolTypes.value = [];
  }
}

function removeAttributeFilter(attribute: PoolAttributeFilter) {
  const index = filterPoolAttributes.value.indexOf(attribute);
  filterPoolAttributes.value.splice(index, 1);
}

async function getTokenPrices() {
  try {
    const tokenAddresses = Object.keys(tokens.value);
    const tokenAddressesString = tokenAddresses.join(',');

    const response = await axios.get(
      `https://api.geckoterminal.com/api/v2/simple/networks/tlos/token_price/${tokenAddressesString}`
    );

    const tokenPrices = response.data.data.attributes.token_prices;
    injectPrices({
      ['0x8d97cea50351fb4329d591682b148d43a0c3611b']: Number(
        tokenPrices['0x8d97cea50351fb4329d591682b148d43a0c3611b']
      ),
      ['0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9']: Number(
        tokenPrices['0x8f7d64ea96d729ef24a0f30b4526d47b80d877b9']
      ),
      ['0x26ed0f16e777c94a6fe798f9e20298034930bae8']: Number(
        tokenPrices['0x26ed0f16e777c94a6fe798f9e20298034930bae8']
      ),
      ['0x058d4893efa235d86cceed5a7eef0809b76c8c66']: Number(
        tokenPrices['0x058d4893efa235d86cceed5a7eef0809b76c8c66']
      ),
      ['0x975ed13fa16857e83e7c493c7741d556eaad4a3f']: Number(
        tokenPrices['0x975ed13fa16857e83e7c493c7741d556eaad4a3f']
      ),
      ['0x7627b27594bc71e6ab0fce755ae8931eb1e12dac']: Number(
        tokenPrices['0x7627b27594bc71e6ab0fce755ae8931eb1e12dac']
      ),
      ['0x568524da340579887db50ecf602cd1ba8451b243']: Number(
        tokenPrices['0x568524da340579887db50ecf602cd1ba8451b243']
      ),
      ['0xa0fb8cd450c8fd3a11901876cd5f17eb47c6bc50']: Number(
        tokenPrices['0xa0fb8cd450c8fd3a11901876cd5f17eb47c6bc50']
      ),
      ['0xb4b01216a5bc8f1c8a33cd990a1239030e60c905']: Number(
        tokenPrices['0xb4b01216a5bc8f1c8a33cd990a1239030e60c905']
      ),
      ['0xd5f2a24199c3dfc44c1bf8b1c01ab147809434ca']: Number(
        tokenPrices['0xd5f2a24199c3dfc44c1bf8b1c01ab147809434ca']
      ),
      ['0xd102ce6a4db07d247fcc28f366a623df0938ca9e']: Number(
        tokenPrices['0xd102ce6a4db07d247fcc28f366a623df0938ca9e']
      ),
      ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee']: Number(
        tokenPrices['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee']
      ),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

watch(poolTypeFilter, newPoolTypeFilter => {
  updatePoolFilters(newPoolTypeFilter);
});

onBeforeMount(async () => {
  if (networkSlug === 'telos') {
    await getTokenPrices();
  }
});
</script>

<template>
  <div>
    <!-- <HomePageHero /> -->
    <div class="xl:container xl:px-4 pt-10 md:pt-8 xl:mx-auto">
      <UserInvestedInAffectedPoolAlert />
      <BalStack vertical>
        <div class="px-4 xl:px-0">
          <div>
            <h3>
              {{ networkConfig.chainName }}
              <span class="lowercase">{{ $t('pools') }}</span>
            </h3>
          </div>
          <BalLoadingBlock
            v-if="isLoading"
            :class="['', 'min-w-full']"
            square
            :style="{ width: `200px`, height: '48px' }"
          />
          <div
            v-else
            class="flex justify-start items-center p-4 mt-4 mb-4 space-x-4 text-sm dark:bg-gray-850 rounded-lg border dark:border-0"
          >
            <div>
              TVL: <span class="font-bold">{{ tvl }}</span>
            </div>
            <div>
              Volume 24h:
              <span class="font-bold">{{
                fNum(volumeSnapshot, { style: 'currency' })
              }}</span>
            </div>
            <div>
              Fees 24h:
              <span class="font-bold">{{
                fNum(feesSnapshot, { style: 'currency' })
              }}</span>
            </div>
          </div>
          <div class="flex justify-between items-end mb-2">
            <BalBtn
              v-if="upToSmallBreakpoint"
              color="blue"
              size="sm"
              outline
              :class="{ 'mt-4': upToSmallBreakpoint }"
              @click="navigateToCreatePool"
            >
              {{ $t('createAPool.title') }}
            </BalBtn>
          </div>

          <div
            class="flex flex-col md:flex-row justify-between items-end lg:items-center w-full"
          >
            <BalVStack width="full">
              <BalHStack justify="between" width="full">
                <BalHStack spacing="md">
                  <TokenSearchInput
                    v-model="selectedTokens"
                    @add="addSelectedToken"
                    @remove="removeSelectedToken"
                  />
                  <PoolFeatureSelect
                    v-model:selectedPoolType="poolTypeFilter"
                    v-model:selectedAttributes="filterPoolAttributes"
                  />
                </BalHStack>

                <BalBtn
                  v-if="!upToSmallBreakpoint"
                  color="blue"
                  size="sm"
                  outline
                  :class="{ 'mt-4': upToSmallBreakpoint }"
                  :block="upToSmallBreakpoint"
                  @click="navigateToCreatePool"
                >
                  {{ $t('createAPool.title') }}
                </BalBtn>
              </BalHStack>
              <BalHStack spacing="sm">
                <TransitionGroup name="pop">
                  <BalTag
                    v-for="token in selectedTokens"
                    :key="token"
                    :closeable="true"
                    class="mt-4"
                    @closed="removeSelectedToken"
                  >
                    <BalAsset :address="token" :size="20" class="flex-auto" />
                    <span class="ml-2">{{ getToken(token)?.symbol }}</span>
                  </BalTag>
                </TransitionGroup>

                <Transition name="pop">
                  <BalTag
                    v-if="poolTypeFilter"
                    :closeable="true"
                    class="mt-4"
                    @closed="poolTypeFilter = undefined"
                  >
                    <span>{{ poolTypeFilter }}</span>
                  </BalTag>
                </Transition>

                <TransitionGroup name="pop">
                  <BalTag
                    v-for="attribute in filterPoolAttributes"
                    :key="attribute"
                    :closeable="true"
                    class="mt-4"
                    @closed="removeAttributeFilter(attribute)"
                  >
                    <span>{{ attribute }}</span>
                  </BalTag>
                </TransitionGroup>
              </BalHStack>
            </BalVStack>
          </div>
        </div>
        <PoolsTable
          :data="pools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoading="isLoading"
          :selectedTokens="selectedTokens"
          class="mb-8"
          :sortColumn="initSortCol"
          :hiddenColumns="['migrate', 'actions', 'lockEndDate']"
          :isLoadingMore="isFetchingNextPage"
          :isPaginated="isPaginated"
          skeletonClass="pools-table-loading-height"
          @on-column-sort="onColumnSort"
          @load-more="loadMorePools"
        />
        <!-- <div ref="featuredProtocolsSentinel" />
        <div
          v-if="isElementSupported && isFeaturedProtocolsVisible"
          class="p-4 mt-12 xl:p-0"
        >
          <FeaturedProtocols />
        </div> -->
      </BalStack>
    </div>
  </div>
</template>

<style>
.pools-table-loading-height {
  height: 40rem;
}
</style>
