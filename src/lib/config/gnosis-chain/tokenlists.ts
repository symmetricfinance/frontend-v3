import { TokenListURLMap } from '@/types/TokenList';

const tokenlists: TokenListURLMap = {
  Balancer: {
    Allowlisted:
      'https://raw.githubusercontent.com/centfinance/Symmetric.WebInterface-v2/develop/src/lib/config/listed.tokenlist.json',
  },
  External: [
    'https://unpkg.com/@1hive/default-token-list@latest/build/honeyswap-default.tokenlist.json',
  ],
};

export default tokenlists;
