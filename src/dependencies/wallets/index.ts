import { initSafeConnector } from './safe';
import { initMetamaskConnector } from './metamask';
import { initTallyConnector } from './tally';
import { initWalletconnectConnector } from './walletconnect';
import { initWalletLinkConnector } from './walletlink';
import { initOKXConnector } from './okx';

export function initWalletConnectors() {
  initWalletconnectConnector();
  initMetamaskConnector();
  initSafeConnector();
  initWalletLinkConnector();
  initTallyConnector();
  initOKXConnector();
}
