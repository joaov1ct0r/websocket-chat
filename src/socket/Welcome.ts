import { Socket } from 'socket.io'

export interface SocketWelcomeImp {
  handle(socket: Socket): void
}

export class SocketWelcome implements SocketWelcomeImp {
  handle(socket: Socket): void {
    socket.emit('welcome', { from: 'Server', message: 'Bem Vindo!' })
  }
}
