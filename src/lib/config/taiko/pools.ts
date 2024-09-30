import { Protocol } from '@/composables/useProtocols';
import { PoolFeature, Pools } from '@/types/pools';

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
  DelegateOwner: '0x45250507e29c26c56935148aD6f534A412068e5d',
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
      '0x65d5eebb5f1c767ce42c3ccc8cfd00fb3a114122000000000000000000000003', //USDC-USDC.e
    ],
  },
  PointsGauges: {
    '0x65d5eebb5f1c767ce42c3ccc8cfd00fb3a114122000000000000000000000003': {
      gauge: '0x0447cb41A2a0D4C4A76cA3e2b1be65076DD48A06', //USDC-USDC.e
      symbol: 'USDC-USDC.e',
    },
    '0xe0f51bf8d30db81d0a93125a17a2a40130ad9f7e000200000000000000000004': {
      gauge: '0xc4E44B978c814F9223784031474ba1498bd23335', //WETH-USDC
      symbol: '50WETH-50USDC',
    },
    '0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005': {
      gauge: '0x76930FbaAbDB2D04B41835029D2320B2A0139cc5', //TAIKO-WETH,
      symbol: '80TAIKO-20WETH',
    },
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0xe0f51bf8d30db81d0a93125a17a2a40130ad9f7e000200000000000000000004', //WETH-USDC
      '0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005', //TAIKO-WETH
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
    '0xe0f51bf8d30db81d0a93125a17a2a40130ad9f7e000200000000000000000004': {
      features: {
        [PoolFeature.Points]: {
          featureProtocols: [],
        },
        [PoolFeature.TBXP]: {
          featureProtocols: [],
        },
      },
    },
    '0x65d5eebb5f1c767ce42c3ccc8cfd00fb3a114122000000000000000000000003': {
      features: {
        [PoolFeature.Points]: {
          featureProtocols: [],
        },
        [PoolFeature.TBXP]: {
          featureProtocols: [],
        },
      },
    },
    '0x27ebdb9db75b8ca967ec331cb1e74880f1d7f0a8000200000000000000000005': {
      features: {
        [PoolFeature.Points]: {
          featureProtocols: [],
        },
        [PoolFeature.TBXP]: {
          featureProtocols: [Protocol.Trailblazers],
        },
      },
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
