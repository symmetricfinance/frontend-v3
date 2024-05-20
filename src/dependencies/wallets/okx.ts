import { OKXConnector } from '@/services/web3/connectors/okx/okx.connector';
import { handleDependencyError } from '..';

let _okxConnector;

/**
 * Uses the real metamask connector instance by default but allows injecting metamask connector mocks from tests
 */
export async function initOKXConnector() {
  if (!_okxConnector) {
    // Lazy load dependency to reduce initial bundle size
    const { OKXConnector } = await import(
      '@/services/web3/connectors/okx/okx.connector'
    );
    _okxConnector = OKXConnector;
  }
}

export async function initOKXConnectorForTesting(metamaskConnector) {
  _okxConnector = metamaskConnector;
}

export function getOKXConnector(): OKXConnector {
  if (!_okxConnector) {
    handleDependencyError('OKXConnector');
  }
  return _okxConnector;
}
