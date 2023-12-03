import { RedisAddMessageImp } from '@Redis/AddMessage'
import { IUserData } from '@Socket/socket'

export interface SocketAddMessageImp {
  handle(channel: string, data: IUserData[]): Promise<void>
}

export class SocketAddMessage implements SocketAddMessageImp {
  private readonly _redisAddMessage: RedisAddMessageImp

  constructor(redisAddMessage: RedisAddMessageImp) {
    this._redisAddMessage = redisAddMessage
  }

  public async handle(channel: string, data: IUserData[]): Promise<void> {
    await this._redisAddMessage.execute(channel, data)
  }
}
