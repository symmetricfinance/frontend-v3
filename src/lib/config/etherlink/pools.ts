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
    AllowList: [],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0xed18b89e2a1b64e4390099869ae7010e47261086000200000000000000000002', // WXTZ-USDC
      '0xe9ea69169449fbb708bcec267f3e9c0643ecfb52000200000000000000000003', // WETH-USDC
    ],
  },
  Factories: {
    '0x4e4131dc27ed9501ac5feb76f94572fdae9f0fd0': 'weightedPool', // Weighted V5
    '0xfef39453770ff2c6b2f453d1b6d075623a79e3eb': 'composableStablePool', // ComposableStable V5
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
    '0x6fbfcf88db1aada31f34215b2a1df7fafb4883e900000000000000000000000d': {
      name: 'Burn tSYMM emissions',
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
