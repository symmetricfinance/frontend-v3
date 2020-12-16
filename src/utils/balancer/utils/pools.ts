import { JsonRpcProvider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';
import Multicaller from '@snapshot-labs/snapshot.js/src/utils/multicaller';
import { getAddress } from '@ethersproject/address';
import set from 'lodash/set';
import { abi as vaultAbi } from '@/utils/balancer/abi/Vault.json';
import { abi as tokenizerAbi } from '@/utils/balancer/abi/FixedSetPoolTokenizer.json';
import { abi as cwpAbi } from '@/utils/balancer/abi/CWPTradingStrategy.json';
import { abi as flattenedAbi } from '@/utils/balancer/abi/FlattenedTradingStrategy.json';
import { VAULT_ADDRESS } from '@/utils/balancer/constants';
import { sendTransaction } from '@snapshot-labs/snapshot.js/src/utils';

function formatPool(pool) {
  pool.strategy.swapFeePercent = parseFloat(
    formatUnits(pool.strategy.swapFee || BigNumber.from(0), 16)
  );

  switch (pool.strategyType) {
    case 0: {
      pool.strategy.name = 'Constant weighted product';
      const totalWeight = pool.strategy.weights.reduce(
        (a, b) => a.add(b),
        BigNumber.from(0)
      );
      pool.strategy.weightsPercent = pool.strategy.weights.map(
        weight =>
          (100 / parseFloat(formatUnits(totalWeight, 10))) *
          parseFloat(formatUnits(weight, 10))
      );
      break;
    }
    case 1: {
      pool.strategy.name = 'Flattened curve';
      pool.strategy.weightsPercent = pool.tokens.map(
        () => 100 / pool.tokens.length
      );
      break;
    }
  }
  return pool;
}

function formatPools(pools) {
  return Object.fromEntries(
    Object.entries(pools).map(pool => [pool[0], formatPool(pool[1])])
  );
}

export async function getPools(
  network: string,
  provider: JsonRpcProvider,
  poolIds: string[]
) {
  let multi = new Multicaller(network, provider, vaultAbi);
  let pools = {};
  poolIds.forEach(id => {
    const strategyType = parseInt(id.slice(25, 26));
    const strategyAddress = id.slice(26);
    set(pools, `${id}.id`, id);
    set(pools, `${id}.strategyType`, strategyType);
    set(pools, `${id}.strategyAddress`, getAddress(strategyAddress));
    multi.call(`${id}.tokens`, VAULT_ADDRESS, 'getPoolTokens', [id]);
    multi.call(`${id}.controller`, VAULT_ADDRESS, 'getPoolController', [id]);
  });
  pools = await multi.execute(pools);

  const abis = [...vaultAbi, ...cwpAbi, ...flattenedAbi, ...tokenizerAbi];
  multi = new Multicaller(network, provider, abis);
  poolIds.forEach(id => {
    const pool = pools[id];
    const address = pool.strategyAddress;
    multi.call(`${id}.tokenBalances`, VAULT_ADDRESS, 'getPoolTokenBalances', [
      id,
      pool.tokens
    ]);
    multi.call(`${id}.strategy.swapFee`, address, 'getSwapFee');
    set(pools, `${id}.strategy.type`, pool.strategyType);
    set(pools, `${id}.strategy.address`, address);
    if (pool.strategyType === 0) {
      multi.call(`${id}.strategy.totalTokens`, address, 'getTotalTokens');
      pool.tokens.forEach((token, i) =>
        multi.call(`${id}.strategy.weights[${i}]`, address, 'getWeight', [
          token
        ])
      );
    } else if (pool.strategyType === 1) {
      // multi.call(`${id}.strategy.amp`, address, 'getAmp');
    }
    if (pool.controller === '0x4AAc4d91cD6AA57AEe6DD379B63D0bCaD9D91f49') {
      set(pools, `${id}.tokenizer.address`, pool.controller);
      multi.call(`${id}.tokenizer.name`, pool.controller, 'name');
      multi.call(`${id}.tokenizer.symbol`, pool.controller, 'symbol');
      multi.call(`${id}.tokenizer.decimals`, pool.controller, 'decimals');
      multi.call(`${id}.tokenizer.totalSupply`, pool.controller, 'totalSupply');
    }
  });
  pools = await multi.execute(pools);
  return formatPools(pools);
}

export async function getPool(
  network: string,
  provider: JsonRpcProvider,
  id: string
) {
  const pools = await getPools(network, provider, [id]);
  return formatPool(pools[id]);
}

export async function joinPool(web3, address, params: any[]) {
  return await sendTransaction(web3, address, tokenizerAbi, 'joinPool', params);
}

export async function exitPool(web3, address, params: any[]) {
  return await sendTransaction(web3, address, tokenizerAbi, 'exitPool', params);
}
