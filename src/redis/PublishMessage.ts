import { BaseRedis } from '@Redis/BaseRedis'

export interface RedisPublishMessageImp {
  execute(channel: string, user: string, message: string): Promise<void>
}

export class RedisPublishMessage
  extends BaseRedis
  implements RedisPublishMessageImp
{
  public async execute(
    channel: string,
    user: string,
    message: string,
  ): Promise<void> {
    await this._redis.publish(
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
