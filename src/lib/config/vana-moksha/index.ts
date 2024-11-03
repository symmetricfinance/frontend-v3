import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '14800',
  chainId: 14800,
  chainName: 'Moksha',
  name: 'Vana Moksha',
  shortName: 'vana-moksha',
  monorepoName: 'vana-moksha',
  slug: 'vana-moksha',
  network: 'vana-moksha',
  trustWalletNetwork: 'vana-moksha',
  unknown: false,
  visibleInUI: false,
  testNetwork: true,
  rpc: `https://moksha-vana-rpc.tech-coha05.xyz`,
  ws: ``,
  explorer: 'https://moksha.vanascan.io/',
  explorerName: 'Vanascan',
  subgraph:
    'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-moksha/1.0.0/gn',
  balancerApi: '',
  poolsUrlV2:
    'https://storageapi.fleek.co/johngrantuk-team-bucket/poolsV2.json',
  subgraphs: {
    main: [
      'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-moksha/1.0.0/gn',
    ],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: '',
  supportsEIP1559: true,
  supportsElementPools: false,
  blockTime: 32,
  nativeAsset: {
    name: 'VANA',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'VANA',
    decimals: 18,
    deeplinkId: 'vana',
    logoURI: 'tokens/vana.png',
    minTransactionBuffer: '0.0005',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'vana',
      platformId: 'ethereum',
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
