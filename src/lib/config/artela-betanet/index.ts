import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import tokenlists from './tokenlists';
import tokens from './tokens';
import pools from './pools';
import rateProviders from './rateProviders';

const config: Config = {
  key: '11822',
  chainId: 11822,
  chainName: 'Artela Betanet',
  name: 'Artela Betanet',
  shortName: 'Artela Betanet',
  monorepoName: 'artela-betanet',
  slug: 'artela-betanet',
  network: 'artela-betanet',
  trustWalletNetwork: 'artela-betanet',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://betanet-rpc1.artela.network',
  explorer: 'https://betanet-scan.artela.network/',
  explorerName: 'Artela Betanet Explorer',
  subgraph:
    'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-artela-testnet/prod/gn',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.goldsky.com/api/public/project_clnbo3e3c16lj33xva5r2aqk7/subgraphs/symmetric-artela-testnet/prod/gn',
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
    name: 'Artela',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ART',
    decimals: 18,
    deeplinkId: 'artela',
    logoURI: 'tokens/artela.png',
    minTransactionBuffer: '0.05',
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
