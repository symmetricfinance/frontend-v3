import { Contracts } from '../types';
import * as artelaBetanet from '@/assets/data/contracts/artela-betanet.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  multicall: '0xd07c8635f76e8745Ee7092fbb6e8fbc5FeF09DD7',
  authorizer: artelaBetanet.Authorizer,
  vault: artelaBetanet.Vault,
  weightedPoolFactory: artelaBetanet.WeightedPoolFactory,
  stablePoolFactory: artelaBetanet.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: artelaBetanet.BalancerHelpers,
  balancerQueries: artelaBetanet.BalancerQueries,
  batchRelayer: artelaBetanet.BalancerRelayer,
  gaugeFactory: '',
  balancerMinter: '',
  gaugeController: '',
  tokenAdmin: '',
  veBAL: '',
  veDelegationProxy: '',
  veBALHelpers: '',
  feeDistributor: '',
  feeDistributorDeprecated: '',
  faucet: '',
  gaugeRewardsHelper: '',
};

export default contracts;
