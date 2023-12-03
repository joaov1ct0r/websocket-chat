import Redis from 'ioredis'

export interface RedisPublishMessageImp {
  execute(
    redis: Redis,
    channel: string,
    user: string,
    message: string,
  ): Promise<void>
}

export class RedisPublishMessage implements RedisPublishMessageImp {
  public async execute(
    redis: Redis,
    channel: string,
    user: string,
    message: string,
  ): Promise<void> {
    await redis.publish(
      channel,
      JSON.stringify({
        user,
        message,
      }),
      (error) => {
        if (error) {
          throw new Error(`Erro no redis - ${error}`)
        }
      },
    )
  }
}
