import * as Protocol from '../shared/protocol';
import { ISocketHandler } from './socket_handler_interface';
import * as io from 'socket.io-client';

export class SocketHandler implements ISocketHandler {
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
    // Temporary copypaste color randomizer
    const color: string =
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    this.socket.emit(
      Protocol.SOCKET_EVENT.JOIN_GAME,
      userName,
      color,
      roomIndex
    );
  }
}
