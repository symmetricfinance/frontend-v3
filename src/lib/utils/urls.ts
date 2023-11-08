import { Wallet } from '@/providers/wallet.provider';
import config from '@/lib/config';
import { Network } from '@/lib/config/types';

function getNetworkIconName(network: Network) {
  return config[Number(network)].slug;
}

export function buildNetworkIconURL(network: Network | string): string {
  const networkName =
    typeof network === 'string' ? network : getNetworkIconName(network);
  console.log('network: ', network);
  // if (
  //   network === 41 ||
  //   network === 'telos-testnet' ||
  //   network === 40 ||
  //   network === 'telos'
  // ) {
  //   const result = new URL(
  //     // https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url
  //     // Warning: Don't extract this template into a variable or it will stop working in production builds
  //     `/src/assets/images/icons/networks/telos.png`,
  //     import.meta.url
  //   ).href;
  //   return result;
  // }

  const result = new URL(
    // https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url
    // Warning: Don't extract this template into a variable or it will stop working in production builds
    `/src/assets/images/icons/networks/${networkName}.svg`,
    import.meta.url
  ).href;
  return result;
}

export function buildServiceIconURL(service: string): string {
  return new URL(
    // https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url
    // Warning: Don't extract this template into a variable or it will stop working in production builds
    `/src/assets/images/services/${service}.svg`,
    import.meta.url
  ).href;
}

export function buildConnectorIconURL(wallet: Wallet): string {
  return new URL(
    // https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url
    // Warning: Don't extract this template into a variable or it will stop working in production builds
    `/src/assets/images/connectors/${wallet}.svg`,
    import.meta.url
  ).href;
}
