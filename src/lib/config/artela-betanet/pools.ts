import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    staBAL: '',
    bbAaveUSD: {
      v1: '',
      v2: '',
      v3: '',
    },
    veBAL: '',
  },
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: false,
  DelegateOwner: '0x91382D68A668D541C9d5Cdb4fCe62d8A1Eb87b56',
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
  ],
  Stable: {
    AllowList: [
      '0x778fdff4348088a059a6ea38c905870f9c69803c000000000000000000000005', //USDC-USDT
    ],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0x6c6f41b332652a89026f439e400e6124b3c6c784000100000000000000000002', // BTC/ETH/USDC
      '0x20e517b33a5004e0e97b4c322af3ad53dfde0c3a000200000000000000000004', //aSYMM/USDC
      '0xd91a286f125f7da111010163b31e0b045811be1a000200000000000000000003', //aSYMM/WART
    ],
  },
  Factories: {
    '0x7e3dAe5fd8FaED7C3Bef04F987c2eF68A9A350A4': 'weightedPool',
    '0xC941936cE60223963A6aab6Bdb7dF0edF54c4EAa': 'composableStablePool',
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {},
  Deep: [],
  BoostedApr: [],
  DisabledJoins: [],
  Deprecated: {
    deprecatedid: {}, //Used for unit testing
  },
  ExitViaInternalBalance: [],
  Risks: {},
};

export default pools;
