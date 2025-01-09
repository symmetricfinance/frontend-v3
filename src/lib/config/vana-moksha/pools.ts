import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    veBAL: '',
  },
  Pagination: {
    PerPage: 15,
    PerPool: 15,
    PerPoolInitial: 5,
  },
  BoostsEnabled: true,
  DelegateOwner: '0x7255Db0d1C1B93Fb756157074fa0613Aa6878F31',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [
    '0xe9b5659a77148a7ec25de40388d0bf9e89331ad0000000000000000000000003', //USDC-USDT
  ],
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
      // '0xe9b5659a77148a7ec25de40388d0bf9e89331ad0000000000000000000000003', //USDC-USDT
    ],
  },

  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0xd31a782e34c342a8d6d0108b1430f31b3ef3a995000200000000000000000002', //WVANA-USDC
      '0x47476aacdb93863f25e0e9545f36d1bd5c1381f2000200000000000000000004', //VANA-VOL
    ],
  },
  Factories: {
    '0x8670184f35f9a7b4e28269bee0a7475ea681493d': 'weightedPool', // Weighted V5
    '0xc7623faa9e41daaf854f07b5b45e70cf1d68583e': 'composableStablePool', // ComposableStable V5
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {},
  Deep: [],
  Deprecated: {},
  GaugeMigration: {},
  BoostedApr: [],
  DisabledJoins: [],
  Issues: {},
};

export default pools;
