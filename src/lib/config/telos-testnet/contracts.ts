import { Contracts } from '../types';
import * as telosTestnet from '@/assets/data/contracts/telos-testnet.json';

const contracts: Contracts = {
  merkleRedeem: '',
  merkleOrchard: '',
  merkleOrchardV2: telosTestnet.MerkleOrchard,
  multicall: '0xc36654661a2A9Db651636723067afDc0CF407dBb',
  authorizer: telosTestnet.Authorizer,
  vault: telosTestnet.Vault,
  weightedPoolFactory: telosTestnet.WeightedPoolFactory,
  stablePoolFactory: telosTestnet.ComposableStablePoolFactory,
  lidoRelayer: '',
  balancerHelpers: telosTestnet.BalancerHelpers,
  balancerQueries: telosTestnet.BalancerQueries,
  batchRelayer: telosTestnet.BalancerRelayer,
  veBAL: '',
  gaugeController: telosTestnet.GaugeController,
  gaugeFactory: telosTestnet.LiquidityGaugeFactory,
  balancerMinter: telosTestnet.BalancerMinter,
  tokenAdmin: telosTestnet.BalancerTokenAdmin,
  veDelegationProxy: telosTestnet.VotingEscrowDelegationProxy,
  veBALHelpers: '',
  feeDistributor: '',
  feeDistributorDeprecated: '',
  faucet: '',
  omniVotingEscrow: '',
};

export default contracts;
