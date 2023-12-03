import { RedisGetMessageImp } from '@Redis/GetMessages'

export interface SocketGetMessageImp {
  handle(channel: string): Promise<string>
}

export class SocketGetMessage implements SocketGetMessageImp {
  private readonly _redisGetMessage: RedisGetMessageImp

  constructor(redisGetMessage: RedisGetMessageImp) {
    this._redisGetMessage = redisGetMessage
  }

  public async handle(channel: string): Promise<string> {
    const messages = await this._redisGetMessage.execute(channel)
    return messages
  }
}
