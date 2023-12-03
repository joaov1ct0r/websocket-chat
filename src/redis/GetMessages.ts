import { BaseRedis } from '@Redis/BaseRedis'

export interface RedisGetMessageImp {
  execute(channel: string): Promise<string>
}

export class RedisGetMessage extends BaseRedis implements RedisGetMessageImp {
  public async execute(channel: string): Promise<string> {
    const messages = await this._redis.get(channel, (error, result) => {
      if (error) {
        throw new Error(`Erro no redis - ${error}`)
      }

      if (result === null || result === undefined) {
        return JSON.stringify([])
      }

      return result
    })

    return messages as string
  }
}
