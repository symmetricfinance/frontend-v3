import { useUserAgent } from './useUserAgent';

type NonMetaMaskFlag =
  | 'isRabby'
  | 'isBraveWallet'
  | 'isTrustWallet'
  | 'isLedgerConnect'
  | 'isOKExWallet'
  | 'isOkxWallet';

const allNonMetamaskFlags: NonMetaMaskFlag[] = [
  'isRabby',
  'isBraveWallet',
  'isTrustWallet',
  'isLedgerConnect',
  'isOKExWallet',
  'isOkxWallet',
];

const ua = navigator.userAgent;
const isOKApp = /OKApp/i.test(ua);

export function useWalletHelpers() {
  const { isMobile } = useUserAgent();

  function getIsMetaMaskWallet(): boolean {
    return Boolean(
      window.ethereum?.isMetaMask &&
        !allNonMetamaskFlags.some(flag => window.ethereum?.[flag])
    );
  }

  function getIsOKXkWalletBrowser(): boolean {
    return isMobile && isOKApp;
  }

  function getIsMetaMaskBrowser(): boolean {
    return isMobile && getIsMetaMaskWallet();
  }

  return { getIsMetaMaskWallet, getIsMetaMaskBrowser, getIsOKXkWalletBrowser };
}
