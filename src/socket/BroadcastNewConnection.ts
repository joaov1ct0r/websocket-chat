import { Socket } from 'socket.io'

export interface SocketBroadcastNewConnectionImp {
  handle(socket: Socket): void
}

export class SocketBroadcastNewConnection
  implements SocketBroadcastNewConnectionImp
{
  handle(socket: Socket): void {
    socket.broadcast.emit('new connection', {
      from: 'Server',
      message: 'Novo usuario conectado!',
    })
  }
}
