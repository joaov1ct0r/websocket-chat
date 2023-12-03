import Redis from 'ioredis'

export interface RedisSubscribeToChannelImp {
  execute(
    redis: Redis,
    channel: string,
    callback: (message: string) => void,
  ): Promise<void>
}

export class RedisSubscribeToChannel implements RedisSubscribeToChannelImp {
  public async execute(
    redis: Redis,
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    await redis.subscribe(channel, (error, result) => {
      if (error) {
        throw new Error(`Erro no redis - ${error}`)
      }

      const message = result as string

      callback(message)
    })
  }
}
