import { Swap } from '@balancer-labs/sor/dist/types';
import { Web3Provider } from '@ethersproject/providers';
import { MaxUint256 } from '@ethersproject/constants';
import { SwapV2 } from 'sorv2package/dist/types';
import { BigNumber } from 'bignumber.js';
import { sendTransaction } from '@/utils/balancer/web3';
import exchangeProxyAbi from '@/abi/ExchangeProxy.json';
import vaultAbi from '@/abi/Vault.json';
import configs from '@/config';
import { ETHER } from '@/constants/tokenlists';
import { SorReturn } from '@/utils/balancer/helpers/sor/sorManager';

type FundManagement = {
  sender: string;
  recipient: string;
  fromInternalBalance: boolean;
  toInternalBalance: boolean;
};

export async function swapIn(
  network: string,
  provider: Web3Provider,
  sorReturn: SorReturn,
  tokenInAmount: BigNumber,
  tokenOutAmountMin: BigNumber
): Promise<any> {
  if (sorReturn.isV1swap) {
    return batchSwapGivenInV1(
      network,
      provider,
      sorReturn.tokenIn,
      sorReturn.tokenOut,
      tokenInAmount,
      tokenOutAmountMin,
      sorReturn.v1result[0]
    );
  } else {
    return batchSwapGivenInV2(
      network,
      provider,
      sorReturn.v2result.tokenIn,
      sorReturn.v2result.tokenOut,
      tokenInAmount,
      tokenOutAmountMin,
      sorReturn.v2result.swaps,
      sorReturn.v2result.tokenAddresses
    );
  }
}

export async function swapOut(
  network: string,
  provider: Web3Provider,
  sorReturn: SorReturn,
  tokenInAmountMax: BigNumber,
  tokenOutAmount: BigNumber
): Promise<any> {
  if (sorReturn.isV1swap) {
    return batchSwapGivenOutV1(
      network,
      provider,
      sorReturn.tokenIn,
      sorReturn.tokenOut,
      tokenInAmountMax,
      sorReturn.v1result[0]
    );
  } else {
    return batchSwapGivenOutV2(
      network,
      provider,
      sorReturn.v2result.tokenIn,
      sorReturn.v2result.tokenOut,
      tokenInAmountMax,
      tokenOutAmount,
      sorReturn.v2result.swaps,
      sorReturn.v2result.tokenAddresses
    );
  }
}

export async function batchSwapGivenInV1(
  network: string,
  web3: Web3Provider,
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: BigNumber,
  tokenOutAmountMin: BigNumber,
  swaps: Swap[][]
): Promise<any> {
  console.log('[Swapper] batchSwapGivenInV1');
  const overrides: any = {};

  if (tokenIn === ETHER.address) {
    overrides.value = `0x${tokenInAmount.toString(16)}`;
  }

  try {
    return sendTransaction(
      web3,
      configs[network].addresses.exchangeProxy,
      exchangeProxyAbi,
      'multihopBatchSwapExactIn',
      [
        swaps,
        tokenIn,
        tokenOut,
        tokenInAmount.toString(),
        tokenOutAmountMin.toString()
      ],
      overrides
    );
  } catch (e) {
    console.log('[Swapper] batchSwapGivenInV1 Error:', e);
    return Promise.reject(e);
  }
}

export async function batchSwapGivenOutV1(
  network: string,
  web3: Web3Provider,
  tokenIn: string,
  tokenOut: string,
  tokenInAmountMax: BigNumber,
  swaps: Swap[][]
): Promise<any> {
  console.log('[Swapper] batchSwapGivenOutV1');
  const overrides: any = {};

  if (tokenIn === ETHER.address) {
    overrides.value = `0x${tokenInAmountMax.toString(16)}`;
  }

  try {
    return sendTransaction(
      web3,
      configs[network].addresses.exchangeProxy,
      exchangeProxyAbi,
      'multihopBatchSwapExactOut',
      [swaps, tokenIn, tokenOut, tokenInAmountMax.toString()],
      overrides
    );
  } catch (e) {
    console.log('[Swapper] batchSwapGivenOutV1 Error:', e);
    return Promise.reject(e);
  }
}

async function batchSwapGivenInV2(
  network: string,
  web3: Web3Provider,
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: BigNumber,
  tokenOutAmountMin: BigNumber,
  swaps: SwapV2[],
  tokenAddresses: string[]
): Promise<any> {
  console.log('[Swapper] batchSwapGivenInV2');
  const overrides: any = {};

  const address = await web3.getSigner().getAddress();

  const funds: FundManagement = {
    sender: address,
    recipient: address,
    fromInternalBalance: false,
    toInternalBalance: false
  };

  // Limits:
  // +ve means max to send
  // -ve mean min to receive
  // For a multihop the intermediate tokens should be 0
  const limits: string[] = [];
  tokenAddresses.forEach((token, i) => {
    if (token.toLowerCase() === tokenIn.toLowerCase()) {
      limits[i] = tokenInAmount.toString();
    } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
      limits[i] = tokenOutAmountMin.times(-1).toString();
    } else {
      limits[i] = '0';
    }
  });
  console.log('Limits', limits);

  try {
    return sendTransaction(
      web3,
      configs[network].addresses.vault,
      vaultAbi,
      'batchSwapGivenIn',
      [swaps, tokenAddresses, funds, limits, MaxUint256],
      overrides
    );
  } catch (e) {
    console.log('[Swapper] batchSwapGivenInV2 Error:', e);
    return Promise.reject(e);
  }
}

async function batchSwapGivenOutV2(
  network: string,
  web3: Web3Provider,
  tokenIn: string,
  tokenOut: string,
  tokenInAmountMax: BigNumber,
  tokenOutAmount: BigNumber,
  swaps: SwapV2[],
  tokenAddresses: string[]
): Promise<any> {
  console.log('[Swapper] batchSwapGivenOutV2');
  const overrides: any = {};

  const address = await web3.getSigner().getAddress();

  const funds: FundManagement = {
    sender: address,
    recipient: address,
    fromInternalBalance: false,
    toInternalBalance: false
  };

  // Limits:
  // +ve means max to send
  // -ve mean min to receive
  // For a multihop the intermediate tokens should be 0
  const limits: string[] = [];
  tokenAddresses.forEach((token, i) => {
    if (token.toLowerCase() === tokenIn.toLowerCase()) {
      limits[i] = tokenInAmountMax.toString();
    } else if (token.toLowerCase() === tokenOut.toLowerCase()) {
      limits[i] = tokenOutAmount.times(-1).toString();
    } else {
      limits[i] = '0';
    }
  });
  console.log('Limits', limits);

  try {
    return sendTransaction(
      web3,
      configs[network].addresses.vault,
      vaultAbi,
      'batchSwapGivenOut',
      [swaps, tokenAddresses, funds, limits, MaxUint256],
      overrides
    );
  } catch (e) {
    console.log('[Swapper] batchSwapGivenOutV2 Error:', e);
    return Promise.reject(e);
  }
}