import { Contracts } from '../types';
import * as artela from '@/assets/data/contracts/artela.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  multicall: '0xb829a5a0dB469aFa5755E7d885Cf6eEb78178d92',
  authorizer: artela.Authorizer,
  vault: artela.Vault,
  weightedPoolFactory: artela.WeightedPoolFactory,
  stablePoolFactory: artela.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: artela.BalancerHelpers,
  balancerQueries: artela.BalancerQueries,
  batchRelayer: artela.BalancerRelayer,
  gaugeFactory: artela.NoTokenAdminGaugeFactory,
  balancerMinter: artela.L2BalancerPseudoMinter,
  gaugeController: artela.GaugeController,
  tokenAdmin: '',
  veBAL: artela.VotingEscrow,
  veDelegationProxy: artela.VotingEscrowDelegationProxy,
  veBALHelpers: '',
  feeDistributor: artela.FeeDistributor,
  feeDistributorDeprecated: '',
  faucet: '',
  gaugeRewardsHelper: '',
};

export default contracts;
