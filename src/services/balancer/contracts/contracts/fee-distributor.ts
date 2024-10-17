import { TransactionResponse } from '@ethersproject/abstract-provider';
// import { formatUnits } from '@ethersproject/units';
import { BigNumber, Contract } from 'ethers';
import { zipObject } from 'lodash';

import FeeDistributorABI from '@/lib/abi/FeeDistributor.json';
import FeeDistributorStaticABI from '@/lib/abi/FeeDistributorStatic.json';
import { configService } from '@/services/config/config.service';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { BalanceMap } from '@/services/token/concerns/balances.concern';
import { walletService as walletServiceInstance } from '@/services/web3/wallet.service';
import { getOldMulticaller } from '@/dependencies/OldMulticaller';
import { networkSlug } from '@/composables/useNetwork';

export class FeeDistributor {
  // public claimableTokens: any = {
  //   telos: [
  //     '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E', // WTLOS
  //     '0xd5f2a24199C3DFc44C1Bf8B1C01aB147809434Ca', // tSYMM
  //     '0x8d97cea50351fb4329d591682b148d43a0c3611b', // USDC
  //   ],
  //   meter: [
  //     '0x2077a828fd58025655335a8756dbcfeb7e5bec46', //MTRG-wstMTRG
  //     '0x663345e09F4F4437F3D5df39BA5c2B5690532206', //mSYMM
  //   ],
  // };
  public claimableTokens =
    networkSlug === 'telos'
      ? [
          '0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E', // WTLOS
          '0xd5f2a24199C3DFc44C1Bf8B1C01aB147809434Ca', // tSYMM
          '0x8f7D64ea96D729EF24a0F30b4526D47b80d877B9', // USDM
        ]
      : networkSlug === 'meter'
      ? [
          '0x2077a828fd58025655335a8756dbcfeb7e5bec46', //MTRG-wstMTRG
          '0x663345e09F4F4437F3D5df39BA5c2B5690532206', //mSYMM
        ]
      : networkSlug === 'taiko'
      ? [
          '0xAA60Afa2FceC38EE762c52135f6Cbb22D8128DD7', // TSPTS
        ]
      : [];

  constructor(
    public readonly address: string,
    private readonly abi = FeeDistributorABI,
    private readonly staticAbi = FeeDistributorStaticABI,
    private readonly config = configService,
    private readonly walletService = walletServiceInstance,
    private readonly provider = rpcProviderService.jsonProvider
  ) {}

  /**
   * @summary Instantiates a contract instance for the FeeDistributor.
   * @returns Ethers Contract instance
   */
  public getInstance(): Contract {
    return new Contract(this.address, this.abi, this.provider);
  }

  /**
   * @summary Instantiates a multicaller instance of the FeeDistributor
   */
  public getMulticaller() {
    const Multicaller = getOldMulticaller();
    return new Multicaller(this.config.network.key, this.provider, this.abi);
  }

  /**
   * @summary Get claimable protocol fee reward balances
   * @descrition To get claimable balances we have to simulate a transaction to
   * the claimTokens method by modifing the ABI to make it a view function.
   */
  public async getClaimableBalances(userAddress: string): Promise<BalanceMap> {
    const balances = await this.walletService.txBuilder.contract.callStatic<
      BigNumber[]
    >({
      contractAddress: this.address,
      abi: this.staticAbi,
      action: 'claimTokens',
      params: [userAddress, this.claimableTokens],
    });
    const stringBalances = balances.map(balance => balance.toString());

    return zipObject(this.claimableTokens, stringBalances);
  }

  /**
   * @summary Claim all protocol reward token balances.
   */
  public async claimBalances(
    userAddress: string
  ): Promise<TransactionResponse> {
    return await this.walletService.txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: this.abi,
      action: 'claimTokens',
      params: [userAddress, this.claimableTokens],
    });
  }

  /**
   * @summary Claim specific protocol reward token balance.
   */
  public async claimBalance(
    userAddress: string,
    tokenAddress: string
  ): Promise<TransactionResponse> {
    return await this.walletService.txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: this.abi,
      action: 'claimToken',
      params: [userAddress, tokenAddress],
    });
  }

  public async checkpointUser(
    userAddress: string
  ): Promise<TransactionResponse> {
    return await this.walletService.txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: this.abi,
      action: 'checkpointUser',
      params: [userAddress],
    });
  }

  /**
   * @summary Get total token distribution in week.
   * @param {string} token address to check distribution for, either bb-a-USD or BAL
   * @param {number} timestamp unix timestamp of epoch to check, has to be exact
   * epoch timestamp
   */
  public async getTokensDistributedInWeek(
    token: string,
    timestamp: number,
    instance?: Contract
  ): Promise<string> {
    if (!instance) instance = this.getInstance();
    const amount = await instance.getTokensDistributedInWeek(token, timestamp);
    return amount;
    // return formatUnits(amount, 18);
  }

  /**
   * @summary Get total veBAL supply at epoch.
   * @param {number} timestamp unix timestamp of epoch to check, has to be exact
   * epoch timestamp
   */
  public async getTotalSupply(
    timestamp: number,
    instance?: Contract
  ): Promise<string> {
    if (!instance) instance = this.getInstance();
    const amount = await instance.getTotalSupplyAtTimestamp(timestamp);
    return amount;
    // return formatUnits(amount, 18);
  }

  public async getUserBalance(
    userAddress: string,
    timestamp: number,
    instance?: Contract
  ): Promise<string> {
    if (!instance) instance = this.getInstance();
    const amount = await instance.getUserBalanceAtTimestamp(
      userAddress,
      timestamp
    );
    return amount;
    // return formatUnits(amount, 18);
  }
}
