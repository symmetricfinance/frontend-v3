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
  DelegateOwner: '0xa29F1CA1957c164877F6A277C9791ACA3Ad4BD6D',
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
      '0x301b19cf456ac3d988a7390e5e869465d9c8edd6000000000000000000000003', // S-USDC-USDT"
      '0x692745235f6f5da540d2ac066f16fdd5871ecc1d000000000000000000000005', // S-wUSK-USDC
      '0x902ae4c6758a4b18324a4f06b053a1e0f397ee27000000000000000000000004', // S-USDM-USDC-USDT
      '0x9c9fab6ffadb6de10964156ee03f823b53a594fe000000000000000000000002', // S-USDC-USDT
    ],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0x1120ae5bcd8736a3f6ff1c2bfc22413db95e6ede000200000000000000000007', // S-60WTLOS-40USDC
      '0x1fbbf321ec3598f5260b1581a8dfdbe08d902cf7000100000000000000000008', // S-40BTC.b-40ETH-20USDC
      '0x321bda978f6c742b3050ebeeefaca9d83fc975cb000200000000000000000006', // S-80WTLOS-20USDT
      '0x6ec6dab312a3dab963e519b0c44520acaaa6f342000200000000000000000009', // S-80STLOS-20wUSK
      '0x7bb386b78d4f1ed654a3bf1e7081dcda4d8a320400020000000000000000000a', // S-80MST-20USDM
    ],
  },
  Factories: {
    '0xeec5208655feaa474d210cb4b2284af5142ba8ef': 'weightedPool', // Weighted V5
    '0xac584a7ca52f852be3facb359f1959a3b698e6c1': 'composableStablePool', // ComposableStable V5
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {},
  Deep: [
    // '0x5e99843486cf052baf0925a0cdeb40920477295900000000000000000000000b', // USDM/USDC-USDT
  ],
  Deprecated: {},
  GaugeMigration: {},
  BoostedApr: [],
  DisabledJoins: [],
  Issues: {},
};

export default pools;
