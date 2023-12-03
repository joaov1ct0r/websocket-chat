import { Server, Socket } from 'socket.io'
import { Server as httpServer } from 'http'
import { SocketGetMessageImp } from '@Socket/GetMessage'
import { SocketAddMessageImp } from '@Socket/AddMessage'
import { SocketPublishMessageImp } from '@Socket/PublishMessage'
import { SocketSubscribeToChannelImp } from '@Socket/SubscribeToChannel'

export interface IUserData {
  user: string
  message: string
}

export interface SocketHandlerImp {
  init(): void
}

export class SocketHandler {
  private readonly _io: Server
  private readonly _mainChannel: string
  private readonly _socketAddMessage: SocketAddMessageImp
  private readonly _socketGetMessage: SocketGetMessageImp
  private readonly _socketPublishMessage: SocketPublishMessageImp
  private readonly _socketSubscribeToChannel: SocketSubscribeToChannelImp

  constructor(
    httpServer: httpServer,
    socketAddMessage: SocketAddMessageImp,
    socketGetMessage: SocketGetMessageImp,
    socketPublishMessage: SocketPublishMessageImp,
    socketSubscribeToChannel: SocketSubscribeToChannelImp,
  ) {
    this._mainChannel = 'geral'

    const io = new Server(httpServer, {
      cors: {
        origin: ['http://localhost:80'],
        credentials: true,
        methods: ['GET', 'POST'],
        exposedHeaders: ['set-cookie'],
      },
    })

    io.listen(Number(process.env.SERVER_PORT))

    this._io = io
    this._socketAddMessage = socketAddMessage
    this._socketGetMessage = socketGetMessage
    this._socketPublishMessage = socketPublishMessage
    this._socketSubscribeToChannel = socketSubscribeToChannel
  }

  private async handleConnection(socket: Socket) {
    socket.broadcast.emit('new connection', {
      from: 'Server',
      message: 'Novo usuario conectado!',
    })

    socket.emit('welcome', { from: 'Server', message: 'Bem Vindo!' })

    this._socketSubscribeToChannel.handle(this._mainChannel, socket)

    const messages = await this._socketGetMessage.handle(this._mainChannel)
    socket.emit('messages', messages)

    socket.on('new_message', async ({ from, message }) => {
      await this._socketPublishMessage.handle(this._mainChannel, from, message)

      const messages = JSON.parse(
        await this._socketGetMessage.handle(this._mainChannel),
      ) as IUserData[]

      messages.push({ user: from, message })

      await this._socketAddMessage.handle(this._mainChannel, messages)
    })
  }

  public init(): void {
    console.log(
      'Socket running at ' +
        process.env.SOCKET_HOST +
        ':' +
        process.env.SOCKET_PORT,
    )

    this._io.on('connection', async (socket) => {
      await this.handleConnection(socket)
    })
  }
}
