import { Contracts } from '../types';
import * as meter from '@/assets/data/contracts/meter.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  multicall: '0xca11bde05977b3631167028862be2a173976ca11',
  authorizer: meter.Authorizer,
  vault: meter.Vault,
  weightedPoolFactory: meter.WeightedPoolFactory,
  stablePoolFactory: meter.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: meter.BalancerHelpers,
  balancerQueries: meter.BalancerQueries,
  batchRelayer: meter.BalancerRelayer,
  veBAL: meter.VotingEscrow,
  gaugeController: meter.GaugeController,
  gaugeFactory: meter.LiquidityGaugeFactory,
  balancerMinter: meter.BalancerMinter,
  tokenAdmin: meter.MSYMMTokenAdmin,
  veDelegationProxy: meter.VotingEscrowDelegationProxy,
  veBALHelpers: '',
  feeDistributor: '',
  feeDistributorDeprecated: '',
  faucet: '',
  omniVotingEscrow: '',
};

export default contracts;
