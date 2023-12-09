import { SocketAddMessageImp } from '@Socket/AddMessage'
import { SocketGetMessageImp } from '@Socket/GetMessage'
import { SocketPublishMessageImp } from '@Socket/PublishMessage'
import { IUserData } from '@Socket/socket'

export interface SocketHandleNewMessageImp {
  handle({ from, message }: { from: string; message: string }): Promise<void>
}

export class SocketHandleNewMessage implements SocketHandleNewMessageImp {
  private readonly MAIN_CHANNEL: string
  private readonly _socketPublishMessage: SocketPublishMessageImp
  private readonly _socketGetMessage: SocketGetMessageImp
  private readonly _socketAddMessage: SocketAddMessageImp

  constructor(
    socketPublishMessage: SocketPublishMessageImp,
    socketGetMessage: SocketGetMessageImp,
    socketAddMessage: SocketAddMessageImp,
  ) {
    this.MAIN_CHANNEL = 'geral'
    this._socketPublishMessage = socketPublishMessage
    this._socketGetMessage = socketGetMessage
    this._socketAddMessage = socketAddMessage
  }

  public async handle({
    from,
    message,
  }: {
    from: string
    message: string
  }): Promise<void> {
    await this._socketPublishMessage.handle(this.MAIN_CHANNEL, from, message)

    const messages = JSON.parse(
      await this._socketGetMessage.handle(this.MAIN_CHANNEL),
    ) as IUserData[]

    messages.push({ user: from, message })

    await this._socketAddMessage.handle(this.MAIN_CHANNEL, messages)
  }
}
