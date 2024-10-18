import { Config, Network } from './types';

// import arbitrum from './arbitrum';
// import avalanche from './avalanche';
// import base from './base';
// import goerli from './goerli';
import gnosisChain from './gnosis-chain';
// import mainnet from './mainnet';
// import optimism from './optimism';
// import polygon from './polygon';
// import sepolia from './sepolia';
// import zkevm from './zkevm';
import telos from './telos';
// import telosTestnet from './telos-testnet';
import celo from './celo';
import meter from './meter';
import taiko from './taiko';
import etherlink from './etherlink';
import vanaMoksha from './vana-moksha';

const config: Record<Network | number, Config> = {
  [Network.TELOS]: telos,
  [Network.CELO]: celo,
  [Network.GNOSIS]: gnosisChain,
  [Network.METER]: meter,
  [Network.TAIKO]: taiko,
  [Network.ETHERLINK]: etherlink,
  [Network.VANAMOKSHA]: vanaMoksha,
};

export default config;
