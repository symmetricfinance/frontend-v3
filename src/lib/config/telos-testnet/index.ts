import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '41',
  chainId: 41,
  chainName: 'Telos Testnet',
  name: 'Telos Testnet',
  shortName: 'telos-testnet',
  monorepoName: 'telos-testnet',
  slug: 'telos-testnet',
  network: 'telos-testnet',
  trustWalletNetwork: 'telos-testnet',
  unknown: false,
  visibleInUI: true,
  testNetwork: true,
  rpc: `https://testnet15a.telos.net/evm`,
  ws: ``,
  explorer: 'https://testnet.teloscan.io',
  explorerName: 'Teloscan',
  subgraph: 'https://thegraph.symm.fi/subgraphs/name/symmetric/telos-testnet',
  balancerApi: '',
  poolsUrlV2:
    'https://storageapi.fleek.co/johngrantuk-team-bucket/poolsV2.json',
  subgraphs: {
    main: [
      'https://thegraph.symm.fi/subgraphs/name/symmetric/telos-testnet',
      'https://thegraph.symm.fi/subgraphs/name/symmetric/telos-testnet',
    ],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: '',
  supportsEIP1559: false,
  supportsElementPools: false,
  blockTime: 2,
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
