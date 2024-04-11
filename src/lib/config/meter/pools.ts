import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    veBAL: '0xabbcd1249510a6afb5d1e6d055bf86637e7dad63000200000000000000000009',
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
  BlockList: [
    '0x79c308ceab33cfb8aa95f7ab795a0db3d282ee66000200000000000000000004', //temp msymm pool
    '0xb4441a1f946cb3e87de2a09293b6f883e4861aeb000200000000000000000006', //ETH-wstMTRG(missing rate provider)
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
      '0x1ff97abe4c5a4b7ff90949b637e71626bef0dcee000000000000000000000002', //USDT-USDC-suUSD
      '0x2077a828fd58025655335a8756dbcfeb7e5bec46000000000000000000000008', //mtrg-wstMTRG
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
      '0xc4187382305ea2c953f0a164f02b4d27c9957db5000200000000000000000005', //MST-MTRG
      '0x6e1be32644975613212db00bb9762fb6755ab921000200000000000000000007', //ETH-wstMTRG
      '0xabbcd1249510a6afb5d1e6d055bf86637e7dad63000200000000000000000009', //MSYMM-wstMTRG
    ],
  },
  Factories: {
    '0xbd5a48ed2c877033ef379e342ec9c6fe16dc5710': 'weightedPool', // Weighted V5
    '0x7aa0dbfaca97734f4e4ae5df0e3f2f957d76018f': 'composableStablePool', // ComposableStable V5
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
