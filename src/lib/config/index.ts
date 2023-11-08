import { Config, Network } from './types';

// import arbitrum from './arbitrum';
// import avalanche from './avalanche';
// import base from './base';
// import goerli from './goerli';
// import gnosisChain from './gnosis-chain';
// import mainnet from './mainnet';
// import optimism from './optimism';
// import polygon from './polygon';
// import sepolia from './sepolia';
// import zkevm from './zkevm';
import telos from './telos';
import telosTestnet from './telos-testnet';
// import celo from './celo';

const config: Record<Network | number, Config> = {
  [Network.TELOS]: telos,
  [Network.TELOSTESTNET]: telosTestnet,
  // [Network.CELO]: celo,
  // [Network.MAINNET]: mainnet,
  // [Network.GOERLI]: goerli,
  // [Network.POLYGON]: polygon,
  // [Network.ARBITRUM]: arbitrum,
  // [Network.OPTIMISM]: optimism,
  // [Network.GNOSIS]: gnosisChain,
  // [Network.ZKEVM]: zkevm,
  // [Network.AVALANCHE]: avalanche,
  // [Network.SEPOLIA]: sepolia,
  // [Network.BASE]: base,
};

export default config;
