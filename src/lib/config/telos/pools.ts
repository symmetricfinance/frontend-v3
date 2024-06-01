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
  BlockList: [
    '0x9023df6f6bcb1bae6298e6c783810bea75353659000000000000000000000005',
    '0xe79aa3ea990ad29a13a544d3ebfdb7bbc8a04ef1000200000000000000000007',
    '0xd757973e91a8045808e8cd37cc2b7df128e7ca2c00000000000000000000000d',
    '0xbb8a33dbbf10882d3d8d9180c56ff13ad6fd917d000200000000000000000011',
    '0x09ef3684052c0566caa6fc61008922030ff455b1000200000000000000000010',
    // '0x38c2609cabbe6cce553eb842b78ea59e5a73552800000000000000000000000e',
    '0x429d4ec4707734b7d9b82d1860202fcba2315481000200000000000000000017', //KINDS-SOULS
    '0x38c2609cabbe6cce553eb842b78ea59e5a73552800000000000000000000000e', //rfTLOS-STLOS
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
      // '0xd757973e91a8045808e8cd37cc2b7df128e7ca2c00000000000000000000000d',
      '0x412b37b8074e25683fdd4f5b2ac0218647dcc50e00000000000000000000001a', //wUSK-USDC
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
      // '0xbb8a33dbbf10882d3d8d9180c56ff13ad6fd917d000200000000000000000011', //TSYMM-TSOUL
      // '0x09ef3684052c0566caa6fc61008922030ff455b1000200000000000000000010', //TKIND-TSOUL
      '0x0e4907910a6bd1a5e95500f7149dd57d328f65cb000200000000000000000012', //BTCb-STLOS
      '0x0485ecd8aa4e0624dd0f5da84139409ab7cee03c000200000000000000000013', //ETH-STLOS
      '0x304970d2511aa3b121148afd387cfa623f551410000200000000000000000016', //MST-USDM
      '0x5fc5f565d6e186a7e03b9ee58bdd551ebff0c0bd000200000000000000000014', //Trump-WTLOS,
      '0x6587a54645c39bc47c96e6f12052db347cc1003a000200000000000000000015', //CMDR-WTLOS
      '0xcf29825dfe41e62e218baa10b791a3d087fa7a83000200000000000000000018', //SOULS-TSYMM
      // '0x429d4ec4707734b7d9b82d1860202fcba2315481000200000000000000000017', //KINDS-SOULS
      '0xcacc06ea569e239d0e4b718e4da1b456d49e06f6000200000000000000000019', //KINDs-SOULS
      '0x03b038d9ad0a69339c9af310ac0f205e2670f9b200020000000000000000001b', //STLOS-wUSK
      '0x30f0797bbe89172b669467039d49d413eb09244b00020000000000000000001c', // SOULS-WTLOS
      '0xfa5f3ba362577e35875e91eb3b16fbe7108f448600020000000000000000001d', // SOULS-SUSD
      '0xceb2728bf37332291fa44891414a53b1d668578200020000000000000000001e', // SOULS-ALI
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
      '0x2b014535525aad053b8811c22a337e57caae82df00020000000000000000000f', //WTLOS-USDC
      '0xbb8a33dbbf10882d3d8d9180c56ff13ad6fd917d000200000000000000000011', //TSYMM-TSOUL
      '0x09ef3684052c0566caa6fc61008922030ff455b1000200000000000000000010', //TKIND-TSOUL
      '0x0e4907910a6bd1a5e95500f7149dd57d328f65cb000200000000000000000012', //BTCb-STLOS
      '0x0485ecd8aa4e0624dd0f5da84139409ab7cee03c000200000000000000000013', //ETH-STLOS
      '0x304970d2511aa3b121148afd387cfa623f551410000200000000000000000016', //MST-USDM
      '0x5fc5f565d6e186a7e03b9ee58bdd551ebff0c0bd000200000000000000000014', //Trump-WTLOS,
      '0x6587a54645c39bc47c96e6f12052db347cc1003a000200000000000000000015', //CMDR-WTLOS
      '0xcf29825dfe41e62e218baa10b791a3d087fa7a83000200000000000000000018', //SOULS-TSYMM
      '0xcacc06ea569e239d0e4b718e4da1b456d49e06f6000200000000000000000019', //KINDs-SOULS
      '0x03b038d9ad0a69339c9af310ac0f205e2670f9b200020000000000000000001b', //STLOS-wUSK
      '0x412b37b8074e25683fdd4f5b2ac0218647dcc50e00000000000000000000001a', //wUSK-USDC
      '0x30f0797bbe89172b669467039d49d413eb09244b00020000000000000000001c', // SOULS-WTLOS
      '0xfa5f3ba362577e35875e91eb3b16fbe7108f448600020000000000000000001d', // SOULS-SUSD
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
