import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    veBAL: '0xbf0fa44e5611c31429188b7dcc59ffe794d1980e000200000000000000000009',
  },
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: true,
  DelegateOwner: '0x7255Db0d1C1B93Fb756157074fa0613Aa6878F31',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [
    '0x9023df6f6bcb1bae6298e6c783810bea75353659000000000000000000000005',
    '0xe79aa3ea990ad29a13a544d3ebfdb7bbc8a04ef1000200000000000000000007',
    '0xd757973e91a8045808e8cd37cc2b7df128e7ca2c00000000000000000000000d',
    // '0x38c2609cabbe6cce553eb842b78ea59e5a73552800000000000000000000000e',
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
      '0x058d4893efa235d86cceed5a7eef0809b76c8c66000000000000000000000004',
      '0x9a77bd2edbbb68173275cda967b76e9213949ace000000000000000000000008',
      '0x5e99843486cf052baf0925a0cdeb40920477295900000000000000000000000b',
      '0x38c2609cabbe6cce553eb842b78ea59e5a73552800000000000000000000000e', //rfTLOS-STLOS
      // '0xd757973e91a8045808e8cd37cc2b7df128e7ca2c00000000000000000000000d',
    ],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [
      '0xbf0fa44e5611c31429188b7dcc59ffe794d1980e000200000000000000000009', //80TSYMM20WTLOS
      '0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59000200000000000000000006',
      '0x0ca5d4b7aeeca61aff78c8f734596ec88456d5c300010000000000000000000a', // BTCb-ETH-USDC
      '0x2b014535525aad053b8811c22a337e57caae82df00020000000000000000000f', //WTLOS-USDC
    ],
  },
  Factories: {
    '0xdd58d43a829067129b8c37f1924d31b1896ac0c6': 'weightedPool', // Weighted V5
    '0x98add7dc34a382e188be709a72ca8fcdf7e548db': 'composableStablePool', // ComposableStable V5
    '0x4ed870363d69f0f2c565332342efc68ca82b544b': 'managedPool',
    '0x266b53bb135f2dbc324b5c5aa281e84f1c105b26': 'liquidityBootstrappingPool',
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [
      '0x058d4893efa235d86cceed5a7eef0809b76c8c66000000000000000000000004',
      '0x9a77bd2edbbb68173275cda967b76e9213949ace000000000000000000000008',
      '0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59000200000000000000000006',
      '0x0ca5d4b7aeeca61aff78c8f734596ec88456d5c300010000000000000000000a',
      '0x5e99843486cf052baf0925a0cdeb40920477295900000000000000000000000b',
      // '0xd757973e91a8045808e8cd37cc2b7df128e7ca2c00000000000000000000000d',
      '0x38c2609cabbe6cce553eb842b78ea59e5a73552800000000000000000000000e', //rfTLOS-STLOS
      '0x2b014535525aad053b8811c22a337e57caae82df00020000000000000000000f', //WTLOS-USDC
    ],
  },
  Metadata: {
    '0x6fbfcf88db1aada31f34215b2a1df7fafb4883e900000000000000000000000c': {
      name: 'Symmetric Team Allocation',
      hasIcon: false,
    },
  },
  Deep: [
    '0x5e99843486cf052baf0925a0cdeb40920477295900000000000000000000000b', // USDM/USDC-USDT
  ],
  Deprecated: {},
  GaugeMigration: {},
  BoostedApr: [],
  DisabledJoins: [],
  Issues: {},
};

export default pools;
