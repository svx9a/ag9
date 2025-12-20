import { io, Socket } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : window.location.origin;

class SocketService {
  private socket: Socket | null = null;

  connect(userId: number) {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.socket?.emit('join-room', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export const socketService = new SocketService();
