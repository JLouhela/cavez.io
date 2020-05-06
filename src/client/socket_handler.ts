import * as Protocol from '../shared/protocol';
import * as io from 'socket.io-client';

// TODO interface for emiting messages to be forwarded to input manager
export class SocketHandler {
  private socketProtocol = window.location.protocol.includes('https')
    ? 'wss'
    : 'ws';

  private socket = io(`${this.socketProtocol}://${window.location.host}`, {
    reconnection: false,
  });

  connectedPromise = new Promise((resolve) => {
    this.socket.on('connect', () => {
      console.log('Connected to server!');
      resolve();
    });
  });

  private gameUpdate() {
    // TODO interface / callback / object for game state update
    console.log('Game update received');
  }

  public connect() {
    this.connectedPromise.then(() => {
      // Register callbacks
      this.socket.on(Protocol.SOCKET_EVENT.GAME_UPDATE, this.gameUpdate);
      this.socket.on(Protocol.SOCKET_EVENT.DISCONNECT, () => {
        console.log('Disconnected from server.');
        // document.getElementById('disconnect-modal').classList.remove('hidden');
        // document.getElementById('reconnect-button').onclick = () => {
        //  window.location.reload();
        // };
      });
    });
  }

  public joinGame(userName: string, roomIndex: number) {
    this.socket.emit(Protocol.SOCKET_EVENT.JOIN_GAME, userName, roomIndex);
  }
}
