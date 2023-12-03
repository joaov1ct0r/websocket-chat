import { IUserData } from '@Socket'
import Redis from 'ioredis'

export interface RedisAddMessageImp {
  execute(redis: Redis, channel: string, data: IUserData[]): Promise<void>
}

export class RedisAddMessage implements RedisAddMessageImp {
  public async execute(
    redis: Redis,
    channel: string,
    data: IUserData[],
  ): Promise<void> {
    await redis.set(channel, JSON.stringify(data), (error) => {
      if (error) {
        throw new Error(`Erro no redis - ${error}`)
      }
    })
  }
}
