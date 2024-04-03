import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    veBAL: '0x0000000000000000000000000000000000000000',
  },
  Pagination: {
    PerPage: 15,
    PerPool: 15,
    PerPoolInitial: 5,
  },
  BoostsEnabled: true,
  DelegateOwner: '0x51db3Cc6431fe6297270360dE47345B0149E1F51',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [''],
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
    AllowList: [
      '0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee000000000000000000000002', //USDT-USDC-suUSD
    ],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0xd9fe77653c2b75cf3442c365a3f1f9c7ed1612c7000200000000000000000003', //MTRG/USDT-USDC-suUSD
    ],
  },
  Factories: {
    '0xbd5A48ED2c877033EF379e342eC9c6fe16dC5710': 'weightedPool', // Weighted V5
    '0x7aa0DBFaCa97734F4E4Ae5DF0E3f2f957D76018F': 'composableStablePool', // ComposableStable V5
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {},
  Deep: [
    '0xd9fe77653c2b75cf3442c365a3f1f9c7ed1612c7000200000000000000000003', //MTRG/USDT-USDC-suUSD
  ],
  Deprecated: {},
  GaugeMigration: {},
  BoostedApr: [],
  DisabledJoins: [],
  Issues: {},
};

export default pools;
