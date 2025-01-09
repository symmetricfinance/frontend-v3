import { Config } from '../types';
import contracts from './contracts';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '100',
  chainId: 100,
  layerZeroChainId: 145,
  supportsVeBalSync: false,
  chainName: 'Gnosis Chain',
  name: 'Gnosis Chain',
  shortName: 'Gnosis',
  monorepoName: 'gnosis',
  slug: 'gnosis-chain',
  network: 'gnosis-chain',
  trustWalletNetwork: 'xdai',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://rpc.gnosischain.com',
  ws: 'wss://rpc.gnosischain.com/wss',
  publicRpc: 'https://rpc.gnosis.gateway.fm',
  explorer: 'https://gnosisscan.io',
  explorerName: 'Gnosisscan',
  balancerApi: '',
  subgraph:
    'https://gateway-arbitrum.network.thegraph.com/api/0d9bf278d67d70c9368a5c70a486a744/subgraphs/id/9kdgh1tW36E8MKthUmZ2FJbe2KCuvkibz984SxbQSdJw',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://gateway-arbitrum.network.thegraph.com/api/0d9bf278d67d70c9368a5c70a486a744/subgraphs/id/9kdgh1tW36E8MKthUmZ2FJbe2KCuvkibz984SxbQSdJw',
    ],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: 'https://bridge.gnosischain.com/',
  supportsEIP1559: true,
  supportsElementPools: true,
  blockTime: 5,
  nativeAsset: {
    name: 'xDAI',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'xDAI',
    decimals: 18,
    deeplinkId: 'xdai',
    logoURI: 'tokens/xdai.png',
    minTransactionBuffer: '0.005',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'xdai',
      platformId: 'xdai',
    },
  },
  addresses: {
    ...contracts,
  },
  pools,
  tokens,
  keys: {},
  gauges: {
    type: 2,
    weight: 100,
  },
  tokenlists,
  rateProviders,
};

export default config;
