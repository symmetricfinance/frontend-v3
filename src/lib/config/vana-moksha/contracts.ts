import { Contracts } from '../types';
import * as vanaMoksha from '@/assets/data/contracts/vana-moksha.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  multicall: '0x9A8F4bA7D632E0D510e7982fF5A9C9e898c102b9',
  authorizer: vanaMoksha.Authorizer,
  vault: vanaMoksha.Vault,
  weightedPoolFactory: vanaMoksha.WeightedPoolFactory,
  stablePoolFactory: vanaMoksha.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: vanaMoksha.BalancerHelpers,
  balancerQueries: vanaMoksha.BalancerQueries,
  batchRelayer: vanaMoksha.BalancerRelayer,
  veBAL: '',
  gaugeController: '',
  gaugeFactory: '',
  balancerMinter: '',
  tokenAdmin: '',
  veDelegationProxy: '',
  veBALHelpers: '',
  feeDistributor: '',
  feeDistributorDeprecated: '',
  faucet: '0x2642b088DdB47A617Ece81bAe2D1F6F7a265D58C',
  omniVotingEscrow: '',
};

export default contracts;
