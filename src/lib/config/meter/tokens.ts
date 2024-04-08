import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WMTR', 'MTRG', 'USDC.eth', 'USDT.eth', 'mSYMM'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0x8d97cea50351fb4329d591682b148d43a0c3611b',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0x160361ce13ec33c993b5cca8f62b6864943eb083',
    WETH: '0x160361ce13ec33c993b5cca8f62b6864943eb083',
    BAL: '0x6ab5792b887Eb3F63A8915240F926e829982d3F5',
    rETH: '',
    stETH: '0x215d603293357ca222be92a1bf75eec38def0aad',
    wstETH: '0xe2de616fbd8cb9180b26fcfb1b761a232fe56717',
  },
  PriceChainMap: {
    /**
     * Addresses must be lower case and map from goerli to mainnet, e.g
     * [goerli address]: mainnet address
     */
    // USDT
    '0x5fa41671c48e3c951afc30816947126ccc8c162e':
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    // USDC
    '0xd86e243fc0007e6226b07c9a50c9d70d78299eb5':
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
};

export default tokens;
