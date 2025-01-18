import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import tokenlists from './tokenlists';
import tokens from './tokens';
import pools from './pools';
import rateProviders from './rateProviders';

const config: Config = {
  key: '11820',
  chainId: 11820,
  chainName: 'Artela',
  name: 'Artela',
  shortName: 'Artela',
  monorepoName: 'artela',
  slug: 'artela',
  network: 'artela',
  trustWalletNetwork: 'artela',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://node-hongkong.artela.network/rpc',
  ws: '',
  explorer: 'https://www.okx.com/web3/explorer/artela/',
  explorerName: 'Artela OKX Explorer',
  subgraph:
    'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-artela/prod/gn',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-artela/prod/gn',
    ],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: '',
  supportsEIP1559: false,
  supportsElementPools: false,
  blockTime: 0.5,
  nativeAsset: {
    name: 'Artela',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ART',
    decimals: 18,
    deeplinkId: 'artela',
    logoURI: 'tokens/artela.png',
    minTransactionBuffer: '0.1',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'artela',
      platformId: 'artela',
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
