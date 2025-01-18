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
  ],
  Stable: {
    AllowList: [
      '0x47eabb60e1e921aad02faa93b2114ed1ab8c5127000000000000000000000003', // ART-wstART
      '0x45e045f1c9e62f67cb81710c68019b71a448c271000000000000000000000002', // ART-stART
    ],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0x04d948f02bfc49a5389adf10e47a0f0c8832f049000200000000000000000004', // 50ART-50USDC
    ],
  },
  Factories: {
    '0xc2eb5c675a49f87843c814fe76576d20e10c3cd0': 'weightedPool',
    '0x266b53bb135f2dbc324b5c5aa281e84f1c105b26': 'composableStablePool',
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
