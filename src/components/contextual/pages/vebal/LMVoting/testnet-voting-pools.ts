import {
  GqlChain,
  GqlPoolMinimalType,
} from '@/services/api/graphql/generated/api-types';
import { ApiVotingPool } from '@/services/balancer/gauges/gauge-controller.decorator';

/*
 Fake voting Pool data to test voting list UI in testnet networks
*/
export function testnetVotingPools(
  testnet: 'SEPOLIA' | 'GOERLI'
): ApiVotingPool[] {
  const STLOS_WTLOS: ApiVotingPool = {
    chain: testnet as GqlChain,
    id: '0x9a77bd2edbbb68173275cda967b76e9213949ace000000000000000000000008',
    address: '0x9A77BD2edbBB68173275Cda967B76E9213949aCe',
    type: GqlPoolMinimalType.Stable,
    symbol: 'STLOS-WTLOS',
    tokens: [
      {
        address: '0xB4B01216a5Bc8F1C8A33CD990A1239030E60C90',
        weight: null,
        symbol: 'STLOS',
        logoURI:
          'https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/stlos.png',
      },
      {
        address: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
        weight: null,
        symbol: 'WTLOS',
        logoURI:
          'https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/telos.png',
      },
    ],
    gauge: {
      address: '0xec678e92afe25bc5ba4bc2e1ff386c775270e49e',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const USDC_USDT: ApiVotingPool = {
    chain: testnet as GqlChain,
    id: '0x058d4893efa235d86cceed5a7eef0809b76c8c66000000000000000000000004',
    address: '0x058d4893efa235d86cceed5a7eef0809b76c8c66',
    type: GqlPoolMinimalType.Stable,
    symbol: 'USDC-USDT',
    tokens: [
      {
        address: '0x8D97Cea50351Fb4329d591682b148D43a0C3611b',
        weight: null,
        symbol: 'USDC',
        logoURI:
          'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      {
        address: '0x975Ed13fa16857E83e7C493C7741D556eaaD4A3f',
        weight: null,
        symbol: 'USDT',
        logoURI:
          'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
    ],
    gauge: {
      address: '0xe4c412962fab7f2d406c43a8da95c68f9d60f24e',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const WTLOS_USDT: ApiVotingPool = {
    chain: testnet as GqlChain,
    id: '0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59000200000000000000000006',
    address: '0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59',
    type: GqlPoolMinimalType.Weighted,
    symbol: '20USDT-80WTLOS',
    tokens: [
      {
        address: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
        weight: '0.8',
        symbol: 'WTLOS',
        logoURI:
          'https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/telos.png',
      },
      {
        address: '0x975Ed13fa16857E83e7C493C7741D556eaaD4A3f',
        weight: '0.2',
        symbol: 'USDT',
        logoURI:
          'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
    ],
    gauge: {
      address: '0xa9d436ab58989354a5c3705f24a5130779055e47',
      isKilled: false,
      relativeWeightCap: '0.6',
      addedTimestamp: 1701860941,
    },
  };

  return [STLOS_WTLOS, USDC_USDT, WTLOS_USDT];
}

export function telosVotingPools(testnet: 'telos'): ApiVotingPool[] {
  const STLOS_WTLOS: ApiVotingPool = {
    chain: testnet as GqlChain,
    id: '0x9a77bd2edbbb68173275cda967b76e9213949ace000000000000000000000008',
    address: '0x9A77BD2edbBB68173275Cda967B76E9213949aCe',
    type: GqlPoolMinimalType.Stable,
    symbol: 'STLOS-WTLOS',
    tokens: [
      {
        address: '0xB4B01216a5Bc8F1C8A33CD990A1239030E60C905',
        weight: null,
        symbol: 'STLOS',
        logoURI:
          'https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/stlos.png',
      },
      {
        address: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
        weight: null,
        symbol: 'WTLOS',
        logoURI:
          'https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/telos.png',
      },
    ],
    gauge: {
      address: '0xec678e92afe25bc5ba4bc2e1ff386c775270e49e',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const USDC_USDT: ApiVotingPool = {
    chain: testnet as GqlChain,
    id: '0x058d4893efa235d86cceed5a7eef0809b76c8c66000000000000000000000004',
    address: '0x058d4893efa235d86cceed5a7eef0809b76c8c66',
    type: GqlPoolMinimalType.Stable,
    symbol: 'USDC-USDT',
    tokens: [
      {
        address: '0x8D97Cea50351Fb4329d591682b148D43a0C3611b',
        weight: null,
        symbol: 'USDC',
        logoURI:
          'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      {
        address: '0x975Ed13fa16857E83e7C493C7741D556eaaD4A3f',
        weight: null,
        symbol: 'USDT',
        logoURI:
          'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
    ],
    gauge: {
      address: '0xe4c412962fab7f2d406c43a8da95c68f9d60f24e',
      isKilled: false,
      addedTimestamp: 1701860941,
      relativeWeightCap: '0.2',
    },
  };

  const WTLOS_USDT: ApiVotingPool = {
    chain: testnet as GqlChain,
    id: '0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59000200000000000000000006',
    address: '0x2d714951f7165a51e8bd61f92d8a979ab0ed4b59',
    type: GqlPoolMinimalType.Weighted,
    symbol: '20USDT-80WTLOS',
    tokens: [
      {
        address: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
        weight: '0.8',
        symbol: 'WTLOS',
        logoURI:
          'https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/telos.png',
      },
      {
        address: '0x975Ed13fa16857E83e7C493C7741D556eaaD4A3f',
        weight: '0.2',
        symbol: 'USDT',
        logoURI:
          'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
    ],
    gauge: {
      address: '0xa9d436ab58989354a5c3705f24a5130779055e47',
      isKilled: false,
      relativeWeightCap: '0.2',
      addedTimestamp: 1701860941,
    },
  };

  const tSYMM_WTLOS: ApiVotingPool = {
    chain: testnet as GqlChain,
    id: '0xbf0fa44e5611c31429188b7dcc59ffe794d1980e000200000000000000000009',
    address: '0xbf0FA44e5611C31429188B7dcc59ffe794D1980e',
    type: GqlPoolMinimalType.Weighted,
    symbol: 'S-80TSYMM-20WTLOS',
    tokens: [
      {
        address: '0xd5f2a24199C3DFc44C1Bf8B1C01aB147809434Ca',
        weight: '0.8',
        symbol: 'tSYMM',
        logoURI:
          'https://raw.githubusercontent.com/centfinance/tokenlists/main/src/assets/images/tokens/TSYMM.png',
      },
      {
        address: '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E',
        weight: '0.2',
        symbol: 'WTLOS',
        logoURI:
          'https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/telos.png',
      },
    ],
    gauge: {
      address: '0x91132ddd744d00d1954b3ee51ffcfde2518bba4c',
      isKilled: false,
      relativeWeightCap: '1.0',
      addedTimestamp: 1701860941,
    },
  };

  const Team_Allocation: ApiVotingPool = {
    chain: testnet as GqlChain,
    id: '0x6fbfcf88db1aada31f34215b2a1df7fafb4883e900000000000000000000000c',
    address: '',
    type: GqlPoolMinimalType.Unknown,
    symbol: 'Team Allocation',
    tokens: [
      {
        address: '0xd5f2a24199C3DFc44C1Bf8B1C01aB147809434Ca',
        weight: '0.8',
        symbol: 'tSYMM',
        logoURI:
          'https://raw.githubusercontent.com/centfinance/tokenlists/main/src/assets/images/tokens/TSYMM.png',
      },
    ],
    gauge: {
      address: '0xcda30664d0df20b19cb35a834594fa8a6a001e5c',
      isKilled: false,
      relativeWeightCap: '0.17',
      addedTimestamp: 1701860941,
    },
  };

  return [tSYMM_WTLOS, STLOS_WTLOS, USDC_USDT, WTLOS_USDT, Team_Allocation];
}
