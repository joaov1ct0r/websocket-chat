import { IUserData } from '@Socket/socket'
import { BaseRedis } from '@Redis/BaseRedis'

export interface RedisAddMessageImp {
  execute(channel: string, data: IUserData[]): Promise<void>
}

export class RedisAddMessage extends BaseRedis implements RedisAddMessageImp {
  public async execute(channel: string, data: IUserData[]): Promise<void> {
    await this._redis.set(channel, JSON.stringify(data), (error) => {
      if (error) {
        throw new Error(`Erro no redis - ${error}`)
      }
    })
  }
}
