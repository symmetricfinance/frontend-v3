import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import tokenlists from './tokenlists';
import tokens from './tokens';
import pools from './pools';
import rateProviders from './rateProviders';

const config: Config = {
  key: '42220',
  chainId: 42220,
  chainName: 'Celo',
  name: 'Celo',
  shortName: 'Celo',
  monorepoName: 'celo',
  slug: 'celo',
  network: 'celo',
  trustWalletNetwork: 'celo',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://forno.celo.org',
  ws: 'wss://forno.celo.org/ws',
  explorer: 'https://celoscan.io',
  explorerName: 'Celoscan',
  subgraph:
    'https://gateway-arbitrum.network.thegraph.com/api/0d9bf278d67d70c9368a5c70a486a744/subgraphs/id/2iS1nCtSKbJT7MZ2xH9hMej3CjJDRRGuv25cAt6kbEwj',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://gateway-arbitrum.network.thegraph.com/api/0d9bf278d67d70c9368a5c70a486a744/subgraphs/id/2iS1nCtSKbJT7MZ2xH9hMej3CjJDRRGuv25cAt6kbEwj',
    ],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: '',
  supportsEIP1559: true,
  supportsElementPools: false,
  blockTime: 2,
  nativeAsset: {
    name: 'Celo',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'CELO',
    decimals: 18,
    deeplinkId: 'celo',
    logoURI: 'tokens/celo.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'celo',
      platformId: 'celo',
    },
  },
  addresses: {
    ...contracts,
  },
  pools,
  tokens,
  keys,
  gauges: {
    type: 2,
    weight: 100,
  },
  tokenlists,
  rateProviders,
};

export default config;
