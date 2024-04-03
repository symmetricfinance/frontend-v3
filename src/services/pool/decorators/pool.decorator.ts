// import { getTimeTravelBlock } from '@/composables/useSnapshots';
import { getTimeTravelBlock } from '@/composables/useSnapshots';
import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import { Pool } from '@/services/pool/types';
import { TokenInfoMap } from '@/types/TokenList';
import PoolService from '../pool.service';
import { PoolMulticaller } from './pool.multicaller';
import axios from 'axios';
import { configService } from '@/services/config/config.service';

/**
 * @summary Decorates a set of pools with additonal data.
 */
export class PoolDecorator {
  constructor(
    public pools: Pool[],
    private readonly poolServiceClass = PoolService,
    private readonly poolSubgraph = balancerSubgraphService
  ) {}

  public async decorate(
    tokens: TokenInfoMap,
    fullDecoration = true
  ): Promise<Pool[]> {
    if (configService.network.chainId === 40) {
      const rewardData: any = localStorage.getItem('REWARD_PRICE');
      if (rewardData) {
        const { timestamp } = JSON.parse(rewardData);
        if (isPriceOutdated(timestamp)) {
          setRewardPriceInLocalStorage()
            .then(() => {
              console.log('REWARD_PRICE has been updated in local storage');
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      } else {
        setRewardPriceInLocalStorage()
          .then(() => {
            console.log('REWARD_PRICE has been set in local storage');
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    }
    const processedPools = this.pools.map(pool => {
      const poolService = new this.poolServiceClass(pool);
      return poolService.pool;
    });

    const poolMulticaller = new PoolMulticaller(processedPools);

    const [poolSnapshots, rawOnchainDataMap] = await Promise.all([
      fullDecoration ? this.getSnapshots() : [],
      poolMulticaller.fetch(),
    ]);

    const promises = processedPools.map(async pool => {
      const poolService = new this.poolServiceClass(pool);

      poolService.setOnchainData(rawOnchainDataMap[pool.id], tokens);

      // All of the following are pre-cached by the Balancer API so we can skip
      // decoration of them if the pool came from the API.
      if (fullDecoration) {
        const poolSnapshot = poolSnapshots.find(p => p.id === pool.id);
        poolService.setFeesSnapshot(poolSnapshot);
        poolService.setVolumeSnapshot(poolSnapshot);
        await poolService.setTotalLiquidity();
        await poolService.setAPR();
      }

      return poolService.pool;
    });

    return await Promise.all(promises);
  }

  /**
   * Re-sets totalLiquidty on all pools, typically after prices have been updated.
   */
  public async reCalculateTotalLiquidities(): Promise<Pool[]> {
    return Promise.all(
      this.pools.map(async pool => {
        const poolService = new this.poolServiceClass(pool);
        await poolService.setTotalLiquidity();
        return poolService.pool;
      })
    );
  }

  /**
   * @summary Get snapshot data of pools
   * @description Getting the past state of pools allows us to calculate
   * snapshot values like volume and fees, currently fixed at past 24h
   * (see getTimeTravelBlock).
   */
  private async getSnapshots(): Promise<Pool[]> {
    const blockNumber = await getTimeTravelBlock();
    console.log(blockNumber);
    const block = { number: blockNumber };
    const isInPoolIds = { id: { in: this.pools.map(pool => pool.id) } };
    try {
      return await this.poolSubgraph.pools.get({
        where: isInPoolIds,
        block,
      });
    } catch (error) {
      console.error('Failed to fetch pool snapshots', error);
      return [];
    }
  }
}

const getWTLOSPrice = async (): Promise<number> => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/token_price/telos?contract_addresses=0xD102cE6A4dB07D247fcc28F366A623Df0938CA9E&vs_currencies=usd'
    );
    const price =
      response.data['0xd102ce6a4db07d247fcc28f366a623df0938ca9e'].usd;
    return price;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const setRewardPriceInLocalStorage = async (): Promise<void> => {
  try {
    const price = await getWTLOSPrice();
    const timestamp = Date.now();
    const data = { price, timestamp };
    localStorage.setItem('REWARD_PRICE', JSON.stringify(data));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const isPriceOutdated = (timestamp: number): boolean => {
  const currentTime = Date.now();
  const fiveMinutesInMillis = 5 * 60 * 1000;
  return currentTime - timestamp > fiveMinutesInMillis;
};
