import { RedisSubscribeToChannelImp } from '@Redis/SubscribeToChannel'
import { Socket } from 'socket.io'

export interface SocketSubscribeToChannelImp {
  handle(channel: string, socket: Socket): Promise<void>
}

export class SocketSubscribeToChannel implements SocketSubscribeToChannelImp {
  private readonly _redisSubscribeToChannel: RedisSubscribeToChannelImp

  constructor(redisSubscribeToChannel: RedisSubscribeToChannelImp) {
    this._redisSubscribeToChannel = redisSubscribeToChannel
  }

  public async handle(channel: string, socket: Socket) {
    await this._redisSubscribeToChannel.execute(channel, (message: string) => {
      socket.emit('messages', message)
    })
  }
}
