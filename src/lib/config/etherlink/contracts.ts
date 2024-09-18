import { Contracts } from '../types';
import * as etherlink from '@/assets/data/contracts/etherlink.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: '',
  multicall: '0xca11bde05977b3631167028862be2a173976ca11',
  authorizer: etherlink.Authorizer,
  vault: etherlink.Vault,
  weightedPoolFactory: etherlink.WeightedPoolFactory,
  stablePoolFactory: etherlink.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: etherlink.BalancerHelpers,
  balancerQueries: '0xfff23CDf2e98b6ea6f0ae856e8DeF6Fdb3141dF1',
  batchRelayer: etherlink.BalancerRelayer,
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
