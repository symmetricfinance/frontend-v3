import { BalancerSDK } from '@balancer-labs/sdk';
import { Network } from '@/lib/config/types';
import { configService } from '@/services/config/config.service';
import { ref } from 'vue';
import { isTestMode } from '@/plugins/modes';

// const customNetwork = {
//   chainId: configService.network.chainId,
//   addresses: {
//     contracts: {
//       vault: configService.network.addresses.vault,
//       multicall: configService.network.addresses.multicall,
//       poolDataQueries: configService.network.addresses.balancerQueries,
//       balancerHelpers: configService.network.addresses.balancerHelpers,
//       balancerRelayer: configService.network.addresses.batchRelayer,
//       weightedPoolFactory: configService.network.addresses.weightedPoolFactory,
//       composableStablePoolFactory:
//         configService.network.addresses.stablePoolFactory,
//     },
//     tokens: {
//       wrappedNativeAsset: configService.network.tokens.Addresses.wNativeAsset,
//       stETH: configService.network.tokens.Addresses.wstETH,
//       wstETH: configService.network.tokens.Addresses.wstETH,
//       bal: configService.network.tokens.Addresses.wNativeAsset,
//     },
//   },
//   urls: {
//     subgraph:
//       'https://app.goldsky.com/dashboard/subgraphs/symmetric-telos-testnet/1.0.0',
//     gaugesSubgraph: '',
//     blockNumberSubgraph: '',
//   },
//   thirdParty: {
//     coingecko: {
//       nativeAssetId: 'telos',
//       platformId: 'telos',
//     },
//   },
//   pools: {},
// };

export const balancer = new BalancerSDK({
  network: configService.network.chainId as Network,
  rpcUrl: configService.rpc,
  customSubgraphUrl: configService.network.subgraph,
  sor: {
    tokenPriceService: 'subgraph',
  },
});

export const hasFetchedPoolsForSor = ref(false);

export async function fetchPoolsForSor() {
  if (hasFetchedPoolsForSor.value) return;

  console.time('fetchPoolsForSor');
  await balancer.swaps.fetchPools();
  hasFetchedPoolsForSor.value = true;
  console.timeEnd('fetchPoolsForSor');
}

if (!isTestMode()) fetchPoolsForSor();
