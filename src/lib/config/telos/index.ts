import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '40',
  chainId: 40,
  chainName: 'Telos',
  name: 'Telos',
  shortName: 'telos',
  monorepoName: 'telos',
  slug: 'telos',
  network: 'telos',
  trustWalletNetwork: 'telos',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: `https://mainnet15a.telos.net/evm`,
  ws: ``,
  explorer: 'https://teloscan.io',
  explorerName: 'Teloscan',
  subgraph:
    'https://thegraph.telos.net/subgraphs/name/symmetric-telos/symmetric-telos-graph',

  balancerApi: '',
  poolsUrlV2:
    'https://storageapi.fleek.co/johngrantuk-team-bucket/poolsV2.json',
  subgraphs: {
    main: [
      'https://thegraph.telos.net/subgraphs/name/symmetric-telos/symmetric-telos-graph',
      'https://thegraph.symm.fi/subgraphs/name/symmetric/telos',
    ],
    aave: '',
    gauge:
      'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-telos-gauges/prod/gn',
    blocks: '',
  },
  bridgeUrl: 'https://bridge.telos.net/bridge',
  supportsEIP1559: false,
  supportsElementPools: false,
  blockTime: 0.02,
  nativeAsset: {
    name: 'TLOS',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'TLOS',
    decimals: 18,
    deeplinkId: 'tlos',
    logoURI: 'tokens/tlos.png',
    minTransactionBuffer: '0.005',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'telos',
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
