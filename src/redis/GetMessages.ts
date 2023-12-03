import Redis from 'ioredis'

export interface RedisGetMessageImp {
  execute(redis: Redis, channel: string): Promise<string>
}

export class RedisGetMessage implements RedisGetMessageImp {
  public async execute(redis: Redis, channel: string): Promise<string> {
    const messages = await redis.get(channel, (error, result) => {
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
