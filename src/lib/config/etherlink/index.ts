import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '42793',
  chainId: 42793,
  chainName: 'Etherlink',
  name: 'Etherlink',
  shortName: 'etherlink',
  monorepoName: 'etherlink',
  slug: 'etherlink',
  network: 'etherlink',
  trustWalletNetwork: 'etherlink',
  unknown: false,
  visibleInUI: false,
  testNetwork: false,
  rpc: 'https://node.mainnet.etherlink.com',
  ws: ``,
  explorer: 'https://explorer.etherlink.com/',
  explorerName: 'Etherlink Explorer',
  subgraph:
    'https://gateway.thegraph.com/api/0d9bf278d67d70c9368a5c70a486a744/subgraphs/id/4y4fC3k9DMrJ9XYY6Z1Qi8DXJkpRrQuQCjh7zBRhxjQr',
  balancerApi: '',
  poolsUrlV2:
    'https://storageapi.fleek.co/johngrantuk-team-bucket/poolsV2.json',
  subgraphs: {
    main: [
      'https://gateway.thegraph.com/api/0d9bf278d67d70c9368a5c70a486a744/subgraphs/id/4y4fC3k9DMrJ9XYY6Z1Qi8DXJkpRrQuQCjh7zBRhxjQr',
    ],
    aave: '',
    gauge: '',
    blocks: '',
  },
  bridgeUrl: 'https://www.etherlinkbridge.com/bridge',
  supportsEIP1559: false,
  supportsElementPools: false,
  blockTime: 0.5,
  nativeAsset: {
    name: 'XTZ',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'XTZ',
    decimals: 18,
    deeplinkId: 'xtz',
    logoURI: 'tokens/xtz.png',
    minTransactionBuffer: '1',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'tezos',
      platformId: 'tezos',
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
