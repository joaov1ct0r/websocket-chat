import { RedisPublishMessageImp } from '@Redis/PublishMessage'

export interface SocketPublishMessageImp {
  handle(channel: string, user: string, message: string): Promise<void>
}

export class SocketPublishMessage implements SocketPublishMessageImp {
  private readonly _redisPublishMessage: RedisPublishMessageImp

  constructor(redisPublishMessage: RedisPublishMessageImp) {
    this._redisPublishMessage = redisPublishMessage
  }

  public async handle(
    channel: string,
    user: string,
    message: string,
  ): Promise<void> {
    await this._redisPublishMessage.execute(channel, user, message)
  }
}
