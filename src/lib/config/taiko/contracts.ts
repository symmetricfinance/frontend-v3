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
  gaugeController: '',
  gaugeFactory: '',
  balancerMinter: '',
  tokenAdmin: '',
  veDelegationProxy: '',
  veBALHelpers: '',
  feeDistributor: '',
  feeDistributorDeprecated: '',
  faucet: '',
  omniVotingEscrow: '',
};

export default contracts;
