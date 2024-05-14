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
  PriceChainMap: {},
};

export default tokens;
