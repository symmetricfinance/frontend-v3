import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WTLOS', 'USDC', 'SYMM', 'USDT', 'STLOS'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0x7e3dAe5fd8FaED7C3Bef04F987c2eF68A9A350A4',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xF5Dd4A1fCE57D9aCd7a4fEF03709402014b56813',
    WETH: '0xF5Dd4A1fCE57D9aCd7a4fEF03709402014b56813',
    BAL: '0x7e3dAe5fd8FaED7C3Bef04F987c2eF68A9A350A4',
    rETH: '',
    wstETH: '0xa9991E4daA44922D00a78B6D986cDf628d46C4DD',
  },
  PriceChainMap: {
    /**
     * Addresses must be lower case and map from goerli to mainnet, e.g
     * [goerli address]: mainnet address
     */
    // USDT
    '0x39d33701581ee17dff7dbeeccc35210aee7b0417':
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0xf9485b3fffd191e28a089c21cd745cc228a181e3':
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0xf5dd4a1fce57d9acd7a4fef03709402014b56813':
      '0x7825e833d495f3d1c28872415a4aee339d26ac88',
  },
};

export default tokens;
