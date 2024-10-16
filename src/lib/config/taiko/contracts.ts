import { Contracts } from '../types';
import * as taiko from '@/assets/data/contracts/taiko.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  multicall: '0xca11bde05977b3631167028862be2a173976ca11',
  authorizer: taiko.Authorizer,
  vault: taiko.Vault,
  weightedPoolFactory: taiko.WeightedPoolFactory,
  stablePoolFactory: taiko.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: taiko.BalancerHelpers,
  balancerQueries: '0x45a2992e1bFdCF9b9AcE0a84A238f2E56F481816',
  batchRelayer: taiko.BalancerRelayer,
  veBAL: '',
  lpVault: '0xc0A740cDd1C647d9c77367E47f0D0c253140E6e3',
  gaugeController: '',
  gaugeFactory: '',
  balancerMinter: '',
  tokenAdmin: '',
  veDelegationProxy: '',
  veBALHelpers: '',
  feeDistributor: '',
  feeDistributorDeprecated: '',
  rewardDistributor: '0xCDa30664D0Df20b19cB35a834594fA8A6A001e5c',
  faucet: '',
  omniVotingEscrow: '',
  gaugeRewardsHelper: '0x7aE881bea5AaA4e8A1dd7cf1B78B92984C3F28D2',
};

export default contracts;
