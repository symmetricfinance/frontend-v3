import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['ESYMM', 'WXTZ', 'USDC', 'USDT'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0x796ea11fa2dd751ed01b53c372ffdb4aaa8f00f9',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb',
    WETH: '0xc9B53AB2679f573e480d01e0f49e2B5CFB7a3EAb',
    BAL: '0x332e0bf729f06C9e08ffA42ABb1312Fcd16289e7',
    rETH: '',
    reward: '',
    rewards: '',
    erc4626Wrappers: {},
    // wstETH: '0xB4B01216a5Bc8F1C8A33CD990A1239030E60C905',
  },
  PriceChainMap: {
    /**
     * Addresses must be lower case and map from goerli to mainnet, e.g
     * [goerli address]: mainnet address
     */
    // USDT
    '0x975ed13fa16857e83e7c493c7741d556eaad4a3f':
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    // USDC
    '0x8d97cea50351fb4329d591682b148d43a0c3611b':
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0xd102ce6a4db07d247fcc28f366a623df0938ca9e':
      '0x7825e833d495f3d1c28872415a4aee339d26ac88',
  },
};

export default tokens;
