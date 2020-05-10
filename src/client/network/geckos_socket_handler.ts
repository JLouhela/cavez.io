import * as Protocol from '../../shared/protocol';
import * as Constants from '../../shared/constants';
import geckos from '@geckos.io/client';

export class GeckosSocketHandler {
  private channel: any = null;

  connectedPromise = new Promise((resolve) => {
    this.channel = geckos({ port: Constants.DEFAULT_PORT });

    this.channel.onConnect((error: any) => {
      if (error) {
        console.error(error.message);
        return;
      }
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
      // listens for a disconnection
      this.channel.onDisconnect(() => {
        console.log('Disconnected from server');
        this.channel = null;
      });
    });
    return this.connectedPromise;
  }

  public joinGame(userName: string, roomIndex: number) {
    // Temporary copypaste color randomizer
    const color: string =
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);

    const event: Protocol.IJoinGameEvent = {
      name: userName,
      color: color,
      room: roomIndex,
    };
    this.channel.emit(Protocol.SOCKET_EVENT.JOIN_GAME, event, {
      // Try to ensure this packet is not lost
      reliable: true,
    });
  }
}