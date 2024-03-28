import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    veBAL: '0xbf0fa44e5611c31429188b7dcc59ffe794d1980e000200000000000000000009',
  },
  Pagination: {
    PerPage: 15,
    PerPool: 15,
    PerPoolInitial: 5,
  },
  BoostsEnabled: true,
  DelegateOwner: '0xa29F1CA1957c164877F6A277C9791ACA3Ad4BD6D',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [],
  IncludedPoolTypes: [
    'Weighted',
    'Stable',
    'MetaStable',
    'LiquidityBootstrapping',
    'Investment',
    'StablePhantom',
    'ComposableStable',
    'Managed',
  ],
  Stable: {
    AllowList: [],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [],
  },
  Factories: {
    '0xdd58d43a829067129b8c37f1924d31b1896ac0c6': 'weightedPool', // Weighted V5
    '0x98add7dc34a382e188be709a72ca8fcdf7e548db': 'composableStablePool', // ComposableStable V5
    '0x4ed870363d69f0f2c565332342efc68ca82b544b': 'managedPool',
    '0x266b53bb135f2dbc324b5c5aa281e84f1c105b26': 'liquidityBootstrappingPool',
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {
    '0x6fbfcf88db1aada31f34215b2a1df7fafb4883e900000000000000000000000c': {
      name: 'Symmetric Team Allocation',
      hasIcon: false,
    },
  },
  Deep: [],
  Deprecated: {},
  GaugeMigration: {},
  BoostedApr: [],
  DisabledJoins: [],
  Issues: {},
};

export default pools;
