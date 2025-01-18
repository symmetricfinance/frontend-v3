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
  chainName: 'Artela Testnet',
  name: 'Artela Testnet',
  shortName: 'Artela Testnet',
  monorepoName: 'artela-betanet',
  slug: 'artela-betanet',
  network: 'artela-betanet',
  trustWalletNetwork: 'artela-betanet',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://api.zan.top/node/v1/artela/testnet/16a5fe0a4ddd4b64a7eb7691079e1ac9',
  // 'https://api.zan.top/node/v1/artela/testnet/43577389172042b2bb9be7d15c89a59d',
  ws: '',
  explorer: 'https://betanet-scan.artela.network/',
  explorerName: 'Artela Testnet Explorer',
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
  blockTime: 5,
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
