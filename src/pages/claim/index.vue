<script lang="ts" setup>
import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { computed, onBeforeMount, watch } from 'vue';

import HeroClaim from '@/components/contextual/pages/claim/HeroClaim.vue';
import BalClaimsTable, {
  RewardRow,
} from '@/components/tables/BalClaimsTable.vue';
import GaugeRewardsTable from '@/components/tables/GaugeRewardsTable.vue';
import ProtocolRewardsTable, {
  ProtocolRewardRow,
} from '@/components/tables/ProtocolRewardsTable.vue';
import { GaugePool, useClaimsData } from '@/composables/useClaimsData';
import useNumbers from '@/composables/useNumbers';
import { isStableLike } from '@/composables/usePoolHelpers';
import { useTokenHelpers } from '@/composables/useTokenHelpers';
import { useTokens } from '@/providers/tokens.provider';
import { bnum } from '@/lib/utils';
import { Gauge } from '@/services/balancer/gauges/types';
import { configService } from '@/services/config/config.service';
import { BalanceMap } from '@/services/token/concerns/balances.concern';
import useWeb3 from '@/services/web3/useWeb3';
// import { buildNetworkIconURL } from '@/lib/utils/urls';
// import { Network } from '@/lib/config/types';
import { poolMetadata } from '@/lib/config/metadata';
import { lpToken, symmSymbol, veSymbol } from '@/composables/useNetwork';
/**
 * TYPES
 */
type GaugeTable = {
  gauge: Gauge;
  pool: GaugePool;
};

/**
 * COMPOSABLES
 */
const { injectTokens, getToken } = useTokens();
const { balToken } = useTokenHelpers();
const { toFiat, fNum } = useNumbers();
const { isWalletReady } = useWeb3();
const {
  gauges,
  gaugePools,
  networkHasProtocolRewards,
  protocolRewards,
  isLoading: isClaimsLoading,
} = useClaimsData();

/**
 * STATE
 */
// interface NetworkMetadata {
//   id: string;
//   name: string;
//   key: Network;
// }

// const networks: NetworkMetadata[] = [
//   {
//     id: 'ethereum',
//     name: 'Ethereum',
//     key: Network.MAINNET,
//   },
//   {
//     id: 'polygon',
//     name: 'Polygon',
//     key: Network.POLYGON,
//   },
//   {
//     id: 'arbitrum',
//     name: 'Arbitrum',
//     key: Network.ARBITRUM,
//   },
// ];

/**
 * COMPUTED
 */
const loading = computed(
  (): boolean => isClaimsLoading.value && isWalletReady.value
);

// const networkBtns = computed(() => {
//   return networks.filter(
//     network => network.key.toString() !== configService.network.key
//   );
// });

const balRewardsData = computed((): RewardRow[] => {
  if (!isWalletReady.value) return [];
  // Using reduce to filter out gauges we don't have corresponding pools for
  return gauges.value.reduce<RewardRow[]>((arr, gauge) => {
    const amount = formatUnits(gauge.claimableTokens, balToken.value.decimals);
    const pool = gaugePools.value.find(pool => pool.id === gauge.poolId);

    if (pool && bnum(amount).gt(0))
      arr.push({
        gauge,
        pool,
        amount,
        value: toFiat(amount, balToken.value.address),
      });

    return arr;
  }, []);
});

const protocolRewardsData = computed((): ProtocolRewardRow[] => {
  return formatRewardsData(protocolRewards.value.v2);
});

/**
 * The feeDistributor contract was updated and so we need to support the old
 * one so that users can claim their rewards. Eventually we should be able to
 * remove this.
 */
const protocolRewardsDataDeprecated = computed((): ProtocolRewardRow[] => {
  return formatRewardsData(protocolRewards.value.v1);
});

const gaugesWithRewards = computed((): Gauge[] => {
  return gauges.value.filter(gauge => gauge.rewardTokens.length > 0);
});

const gaugeTables = computed((): GaugeTable[] => {
  // Only return gauges if we have a corresponding pool and rewards > 0
  return gaugesWithRewards.value.reduce<GaugeTable[]>((arr, gauge) => {
    const pool = gaugePools.value.find(pool => pool.id === gauge.poolId);
    const totalRewardValue = Object.values(gauge.claimableRewards).reduce(
      (acc, reward) => acc.plus(reward),
      bnum(0)
    );

    if (pool && totalRewardValue.gt(0))
      arr.push({
        gauge,
        pool,
      });

    return arr;
  }, []);
});

const networkHasBalClaiming = computed(
  () =>
    !!configService.network.addresses.balancerMinter &&
    configService.network.network !== 'telos'
);

/**
 * METHODS
 */
async function injectRewardTokens(gauges: Gauge[]): Promise<void> {
  const allRewardTokens = gauges.map(gauge => gauge.rewardTokens).flat();
  return await injectTokens(allRewardTokens);
}

async function injectPoolTokens(pools: GaugePool[]): Promise<void> {
  const allPoolTokens = pools.map(pools => pools.tokensList).flat();
  return await injectTokens(allPoolTokens);
}

function gaugeTitle(pool: GaugePool): string {
  const metadata = poolMetadata(pool.id);
  if (metadata?.name) return metadata.name;

  const _tokens = pool.tokens.map(token => ({
    ...token,
    ...getToken(getAddress(token.address)),
  }));

  if (isStableLike(pool.poolType)) {
    return Object.values(_tokens)
      .map(token => token.symbol)
      .join(' / ');
  }

  return Object.values(_tokens)
    .map(
      token =>
        `${fNum(token.weight || '0', {
          style: 'percent',
          maximumFractionDigits: 0,
        })} ${token.symbol}`
    )
    .join(' / ');
}

// function rewardUSDValue(tokenAddress: string, amount: string): string {
//   const token = getToken(tokenAddress);
//   if (!token) return '0';
//   if (token.symbol === 'tSYMM') {
//     return fNum(
//       bnum(amount).times(bbAUSDToken.getRate()).toString(),
//       FNumFormats.fiat
//     );
//   }
//   if (token.symbol === 'WTLOS') {
//     return fNum(
//       bnum(amount).times(bbAUSDToken.getRate()).toString(),
//       FNumFormats.fiat
//     );
//   }
//   return toFiat(amount, tokenAddress);
// }

function formatRewardsData(data?: BalanceMap): ProtocolRewardRow[] {
  if (!isWalletReady.value || !data) return [];

  return Object.keys(data).map(tokenAddress => {
    const token = getToken(tokenAddress);
    const amount = formatUnits(data[tokenAddress], token.decimals);

    return {
      token,
      amount,
      value: toFiat(amount, tokenAddress),
    };
  });
}
// async function getTokenPrices() {
// try {
//   const response = await axios.get(
//     `https://api.geckoterminal.com/api/v2/simple/networks/tlos/token_price/${TOKENS.Addresses.BAL}%2C${TOKENS.Addresses.WETH}`
//   );
//   const tokenPrices = response.data.data.attributes.token_prices;
//   injectPrices({
//     [TOKENS.Addresses.BAL as string]: Number(
//       tokenPrices['0xd5f2a24199c3dfc44c1bf8b1c01ab147809434ca']
//     ),
//     [TOKENS.Addresses.WETH as string]: Number(
//       tokenPrices['0xd102ce6a4db07d247fcc28f366a623df0938ca9e']
//     ),
//   });
// } catch (error) {
//   console.error(error);
//   throw error;
// }
//   try {
//     const response = await axios.get(
//       `https://symm-prices.symmetric.workers.dev/${networkSlug}/prices/${TOKENS.Addresses.BAL},${TOKENS.Addresses.reward}`
//     );
//     response.data.forEach(price => {
//       injectPrices({
//         [getAddress(price.id) as string]: price.price,
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }
// /**
//  * @summary Fetches bb-a-USD rate as an appoximation of USD price.
//  */
// async function getBBaUSDPrice() {
//   if (TOKENS.Addresses.bbaUSDv2) {
//     const approxPrice = bnum(await bbAUSDToken.getRate()).toNumber();
//     injectPrices({
//       [TOKENS.Addresses.bbaUSD as string]: approxPrice,
//       [TOKENS.Addresses.bbaUSDv2 as string]: approxPrice,
//     });
//   }
// }

/**
 * WATCHERS
 */
watch(gauges, async newGauges => {
  if (newGauges) await injectRewardTokens(newGauges);
});

watch(gaugePools, async newPools => {
  if (newPools) await injectPoolTokens(newPools);
});

/**
 * LIFECYCLE
 */
onBeforeMount(async () => {
  // await getTokenPrices();
  // await getBBaUSDPrice();
});
</script>

<template>
  <div>
    <HeroClaim
      :title="$t('claimHero.title')"
      :description="$t('claimHero.description', { veSymbol })"
    />
    <div>
      <div class="xl:container py-12 xl:px-4 xl:mx-auto">
        <h2 class="px-4 xl:px-0 font-body text-2xl font-semibold">
          {{ configService.network.chainName }} {{ $t('liquidityIncentives') }}
        </h2>
        <template v-if="networkHasBalClaiming">
          <div class="mb-16">
            <div class="px-4 xl:px-0">
              <div class="flex items-center mt-6 mb-2">
                <h3 class="inline-block mr-1.5 text-xl">
                  {{ symmSymbol }} {{ $t('incentives') }}
                </h3>
                <BalTooltip
                  iconSize="xs"
                  textAlign="left"
                  class="relative top-px"
                  iconClass="text-secondary"
                  width="60"
                >
                  {{ $t('claimPage.tips.BalIncentives') }}
                </BalTooltip>
              </div>
            </div>
            <BalClaimsTable
              :rewardsData="balRewardsData"
              :isLoading="loading"
            />
          </div>
        </template>
        <template v-if="networkHasProtocolRewards">
          <div class="mb-16">
            <h3 class="inline-block xl:px-0 pl-4 mt-8 mr-1.5 mb-3 text-xl">
              {{ $t('protocolIncentives', { veSymbol }) }}
            </h3>
            <BalTooltip
              iconSize="xs"
              textAlign="left"
              class="relative top-px"
              iconClass="text-secondary"
              width="60"
            >
              {{ $t('claimPage.tips.ProtocolAndVebal', { veSymbol, lpToken }) }}
            </BalTooltip>
            <ProtocolRewardsTable
              :rewardsData="protocolRewardsData"
              :isLoading="loading"
            />
            <ProtocolRewardsTable
              v-if="!loading"
              :rewardsData="protocolRewardsDataDeprecated"
              :isLoading="loading"
              deprecated
            />
          </div>
        </template>
        <div>
          <h3 class="inline-block px-4 xl:px-0 mt-8 mr-1.5 text-xl">
            {{ $t('otherTokenIncentives') }}
          </h3>
          <BalTooltip
            iconSize="xs"
            textAlign="left"
            class="relative top-px"
            iconClass="text-secondary"
            width="60"
          >
            {{ $t('claimPage.tips.OtherIncentives', { symmSymbol }) }}
          </BalTooltip>
        </div>
        <BalLoadingBlock v-if="loading" class="mt-6 mb-2 h-56" />
        <template v-if="!isClaimsLoading && gaugeTables.length > 0">
          <div v-for="{ gauge, pool } in gaugeTables" :key="gauge.id">
            <div class="mb-16">
              <div class="flex px-4 xl:px-0 mt-4">
                <h4 class="mb-2 text-base">
                  {{ gaugeTitle(pool) }}
                </h4>
              </div>
              <GaugeRewardsTable :gauge="gauge" :isLoading="isClaimsLoading" />
            </div>
          </div>
        </template>
        <BalBlankSlate
          v-else-if="
            (!isClaimsLoading && gaugeTables.length === 0) || !isWalletReady
          "
          class="px-4 xl:px-0 mt-4 mb-16"
        >
          {{ $t('noClaimableIncentives') }}
        </BalBlankSlate>
        <!-- <div class="px-4 mb-16 xl:px-0">
          <h2 class="mt-8 text-2xl font-semibold font-body">
            {{ $t('pages.claim.titles.incentivesOnOtherNetworks') }}
          </h2>
          <BalFlexGrid class="mt-4" flexWrap>
            <BalBtn
              v-for="network in networkBtns"
              :key="network.id"
              tag="a"
              :href="`https://app.balancer.fi/#/${network.id}/claim`"
              color="white"
            >
              <img
                :src="buildNetworkIconURL(network.id as unknown as  Network)"
                :alt="network.id"
                class="w-6 h-6 mr-2 rounded-full shadow-sm"
              />
              {{ $t('pages.claim.btns.claimOn') }} {{ network.name }}
            </BalBtn>
          </BalFlexGrid>
          <BalLink
            v-if="isWalletReady"
            tag="router-link"
            to="/ethereum/claim/legacy"
            class="flex items-center"
            >{{ $t('legacyClaims') }}
            <BalIcon name="arrow-right" size="sm" class="mx-1"
          /></BalLink>
        </div> -->
      </div>
    </div>
  </div>
</template>
