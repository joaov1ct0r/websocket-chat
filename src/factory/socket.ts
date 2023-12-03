import { SocketHandler } from '@Socket/socket'
import { Server } from 'http'
import { SocketAddMessage } from '@Socket/AddMessage'
import { SocketGetMessage } from '@Socket/GetMessage'
import { SocketPublishMessage } from '@Socket/PublishMessage'
import { SocketSubscribeToChannel } from '@Socket/SubscribeToChannel'
import { RedisAddMessage } from '@Redis/AddMessage'
import Redis from 'ioredis'
import { RedisPublishMessage } from '@Redis/PublishMessage'
import { RedisSubscribeToChannel } from '@Redis/SubscribeToChannel'
import { RedisGetMessage } from '@Redis/GetMessages'

export interface SocketFactoryImp {
  create(): SocketHandler
}

export class SocketFactory {
  private readonly _httpServer: Server
  private readonly _redis: Redis

  constructor(httpServer: Server, redis: Redis) {
    this._httpServer = httpServer
    this._redis = redis
  }

  public create(): SocketHandler {
    const socketAddMessage = new SocketAddMessage(
      new RedisAddMessage(this._redis),
    )
    const socketGetMessage = new SocketGetMessage(
      new RedisGetMessage(this._redis),
    )

    const socketPublishMessage = new SocketPublishMessage(
      new RedisPublishMessage(this._redis),
    )

    const socketSubscribeToChannel = new SocketSubscribeToChannel(
      new RedisSubscribeToChannel(this._redis),
    )

    return new SocketHandler(
      this._httpServer,
      socketAddMessage,
      socketGetMessage,
      socketPublishMessage,
      socketSubscribeToChannel,
    )
  }
}
