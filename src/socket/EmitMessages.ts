import { Socket } from 'socket.io'

export interface SocketEmitMessagesImp {
  handle(socket: Socket, messages: string): void
}

export class SocketEmitMessages implements SocketEmitMessagesImp {
  handle(socket: Socket, messages: string): void {
    socket.emit('messages', messages)
  }
}
