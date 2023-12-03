import { BaseRedis } from '@Redis/BaseRedis'

export interface RedisSubscribeToChannelImp {
  execute(channel: string, callback: (message: string) => void): Promise<void>
}

export class RedisSubscribeToChannel
  extends BaseRedis
  implements RedisSubscribeToChannelImp
{
  public async execute(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    await this._redis.subscribe(channel, (error, result) => {
      if (error) {
        throw new Error(`Erro no redis - ${error}`)
      }

      const message = result as string

      callback(message)
    })
  }
}
