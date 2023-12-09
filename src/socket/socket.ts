import { Server, Socket } from 'socket.io'
import { Server as httpServer } from 'http'
import { SocketGetMessageImp } from '@Socket/GetMessage'
import { SocketSubscribeToChannelImp } from '@Socket/SubscribeToChannel'
import { SocketWelcomeImp } from '@Socket/Welcome'
import { SocketBroadcastNewConnectionImp } from '@Socket/BroadcastNewConnection'
import { SocketEmitMessagesImp } from '@Socket/EmitMessages'
import { SocketNewMessageImp } from '@Socket/NewMessage'

export interface IUserData {
  user: string
  message: string
}

export interface SocketHandlerImp {
  init(): void
}

export class SocketHandler {
  private readonly MAIN_CHANNEL: string
  private readonly _io: Server
  private readonly _socketGetMessage: SocketGetMessageImp
  private readonly _socketSubscribeToChannel: SocketSubscribeToChannelImp
  private readonly _socketHandleWelcome: SocketWelcomeImp
  private readonly _socketBroadcastNewConnection: SocketBroadcastNewConnectionImp
  private readonly _socketEmitMessages: SocketEmitMessagesImp
  private readonly _socketNewMessage: SocketNewMessageImp

  constructor(
    httpServer: httpServer,
    socketGetMessage: SocketGetMessageImp,
    socketSubscribeToChannel: SocketSubscribeToChannelImp,
    socketHandleWelcome: SocketWelcomeImp,
    socketBroadcastNewConnection: SocketBroadcastNewConnectionImp,
    socketEmitMessages: SocketEmitMessagesImp,
    socketNewMessage: SocketNewMessageImp,
  ) {
    this.MAIN_CHANNEL = 'geral'

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
    this._socketGetMessage = socketGetMessage
    this._socketSubscribeToChannel = socketSubscribeToChannel
    this._socketHandleWelcome = socketHandleWelcome
    this._socketBroadcastNewConnection = socketBroadcastNewConnection
    this._socketEmitMessages = socketEmitMessages
    this._socketNewMessage = socketNewMessage
  }

  private async handleConnection(socket: Socket) {
    this._socketBroadcastNewConnection.handle(socket)

    this._socketHandleWelcome.handle(socket)

    this._socketSubscribeToChannel.handle(this.MAIN_CHANNEL, socket)

    const messages = await this._socketGetMessage.handle(this.MAIN_CHANNEL)
    this._socketEmitMessages.handle(socket, messages)

    socket.on('new_message', this._socketNewMessage.handle)
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
