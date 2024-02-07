import { Interface } from '@ethersproject/abi';
import aaveWrappingAbi from '../abi/AaveWrapping.json';
import {
  EncodeUnwrapAaveStaticTokenInput,
  EncodeWrapAaveStaticTokenInput,
} from '../relayer-types';

export class AaveWrappingService {
  public encodeWrap(params: EncodeWrapAaveStaticTokenInput): string {
    const aaveWrappingLibrary = new Interface(aaveWrappingAbi);

    return aaveWrappingLibrary.encodeFunctionData('wrapAaveDynamicToken', [
      params.staticToken,
      params.sender,
      params.recipient,
      params.amount,
      params.fromUnderlying,
      params.outputReference,
    ]);
  }

  public encodeUnwrap(params: EncodeUnwrapAaveStaticTokenInput): string {
    const aaveWrappingLibrary = new Interface(aaveWrappingAbi);

    return aaveWrappingLibrary.encodeFunctionData('unwrapAaveStaticToken', [
      params.staticToken,
      params.sender,
      params.recipient,
      params.amount,
      params.toUnderlying,
      params.outputReference,
    ]);
  }
}
