import Redis from 'ioredis'
import { IUserData } from '@Socket'
import { RedisAddMessageImp } from '@Redis/AddMessage'
import { RedisGetMessageImp } from '@Redis/GetMessages'
import { RedisPublishMessageImp } from '@Redis/PublishMessage'
import { RedisSubscribeToChannelImp } from '@Redis/SubscribeToChannel'

export interface RedisClientImp {
  addMessage(channel: string, data: IUserData[]): Promise<void>
  getMessage(channel: string): Promise<string>
  publishMessage(channel: string, user: string, message: string): Promise<void>
  subscribeToChannel(
    subscribedChannel: string,
    callback: (message: string) => void,
  ): Promise<void>
}

export class RedisClient implements RedisClientImp {
  private readonly _redis: Redis
  private readonly _redisAddMessage: RedisAddMessageImp
  private readonly _redisGetMessage: RedisGetMessageImp
  private readonly _redisPublishMessage: RedisPublishMessageImp
  private readonly _redisSubscribeToChannel: RedisSubscribeToChannelImp

  constructor(
    redisAddMessage: RedisAddMessageImp,
    redisGetMessage: RedisGetMessageImp,
    redisPublishMessage: RedisPublishMessageImp,
    redisSubscribeToChannel: RedisSubscribeToChannelImp,
  ) {
    this._redis = new Redis({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
    })

    this._redisAddMessage = redisAddMessage
    this._redisGetMessage = redisGetMessage
    this._redisPublishMessage = redisPublishMessage
    this._redisSubscribeToChannel = redisSubscribeToChannel
  }

  public async addMessage(channel: string, data: IUserData[]): Promise<void> {
    await this._redisAddMessage.execute(this._redis, channel, data)
  }

  public async getMessage(channel: string): Promise<string> {
    const messages = await this._redisGetMessage.execute(this._redis, channel)
    return messages
  }

  public async publishMessage(
    channel: string,
    user: string,
    message: string,
  ): Promise<void> {
    await this._redisPublishMessage.execute(this._redis, channel, user, message)
  }

  public async subscribeToChannel(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    await this._redisSubscribeToChannel.execute(this._redis, channel, callback)
  }
}
