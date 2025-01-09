import { reactive, Ref, ref } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';
import QUERY_KEYS from '@/constants/queryKeys';
import useNetwork from '../useNetwork';
// import { getApi } from '@/dependencies/balancer-api';
// import { GqlTokenPrice } from '@/services/api/graphql/generated/api-types';
import { oneMinInMs } from '../useTime';
import { getAddress } from '@ethersproject/address';

/**
 * TYPES
 */
export type TokenPrices = { [address: string]: number };
export type PriceAPIReturn = {
  [chainId: string]: { [address: string]: string };
};
type QueryResponse = TokenPrices;
type QueryOptions = UseQueryOptions<QueryResponse>;

/**
 * Fetches token prices for all provided addresses.
 */
export default function useTokenPricesQuery(
  pricesToInject: Ref<TokenPrices> = ref({}),
  options: QueryOptions = {}
) {
  const { networkId } = useNetwork();
  const queryKey = reactive(
    QUERY_KEYS.Tokens.Prices(networkId, pricesToInject)
  );

  // function priceArrayToMap(prices: GqlTokenPrice[]): TokenPrices {
  //   return prices.reduce(
  //     (obj, item) => ((obj[getAddress(item.address)] = item.price), obj),
  //     {}
  //   );
  // }

  function injectCustomTokens(
    prices: TokenPrices,
    pricesToInject: TokenPrices
  ): TokenPrices {
    for (const address of Object.keys(pricesToInject)) {
      prices[address] = pricesToInject[address];
    }
    return prices;
  }

  const api = 'https://symm-prices.deno.dev/tokens';

  const queryFn = async () => {
    if (api) {
      const data = await fetch(api).then(res => res.json());
      let pricesMap: TokenPrices = {};

      // Iterate over chain IDs and their corresponding token prices
      for (const chainId in data) {
        const chainPrices = data[chainId];
        for (const address in chainPrices) {
          pricesMap[getAddress(address)] = parseFloat(chainPrices[address]);
        }
      }

      // Inject custom token prices
      pricesMap = injectCustomTokens(pricesMap, pricesToInject.value);

      return pricesMap;
    }
    return {};
  };

  return useQuery<QueryResponse>(queryKey, queryFn, {
    staleTime: oneMinInMs,
    ...options,
  });
}
