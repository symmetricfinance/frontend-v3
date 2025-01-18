import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'WART', 'USDC', 'aSYMM', 'USDT', 'ETH'],
  },
  InitialSwapTokens: {
    input: '0xaDCd43c78A914c6B14171aB1380bCFcfa25cd3AD',
    output: '0x4a869ed6b3f74dC41537EF27e8eB3A8676AE4614',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xaDCd43c78A914c6B14171aB1380bCFcfa25cd3AD',
    WETH: '0xaDCd43c78A914c6B14171aB1380bCFcfa25cd3AD',
    BAL: '0x4a869ed6b3f74dC41537EF27e8eB3A8676AE4614',
    bbaUSD: '',
    bbaUSDv2: '',
    rETH: '',
    stMATIC: '',
    stETH: '',
    wstETH: '',
  },
  PriceChainMap: {
    '0x23625ff2aec3a5e3459a9fd75661a135c567b072':
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x9c9df9e55f4770132e586f32741d7e4f80c39b2a':
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0x7bf8b8Da6E71ebc92383dAf6f32F82b073a303cD':
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
};

export default tokens;
