import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['vSYMM', 'WVANA', 'USDC', 'USDT'],
  },
  InitialSwapTokens: {
    input: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    output: '0xb39a50b5806039c82932bb96cefbcbc61231045c',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xbccc4b4c6530F82FE309c5E845E50b5E9C89f2AD',
    WETH: '0xbccc4b4c6530F82FE309c5E845E50b5E9C89f2AD',
    BAL: '0x4e4131dC27ed9501ac5fEb76F94572fDAe9f0fD0',
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
    '0x01079c78199e05d44bbff9e50dbdf765489f16e1':
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    // USDC
    '0xb39a50b5806039c82932bb96cefbcbc61231045c':
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
};

export default tokens;
