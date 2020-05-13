import * as Protocol from '../../shared/protocol';
import * as Constants from '../../shared/constants';
import geckos from '@geckos.io/client';
import { request } from 'express';

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
      // Register callbacks:

      // listens for a disconnection
      this.channel.onDisconnect(() => {
        console.log('Disconnected from server');
        this.channel = null;
      });

      this.channel.on(
        Protocol.SOCKET_EVENT.JOIN_GAME_RESPONSE,
        (response: Protocol.IJoinGameEventResponse) => {
          console.log('Join ' + response.ok);
          this.requestSpawn();
        }
      );

      this.channel.on(
        Protocol.SOCKET_EVENT.SPAWN_RESPONSE,
        (response: Protocol.ISpawnResponse) => {
          console.log('Spawnpoint received ' + response.x + ', ' + response.y);
          // TODO create entity with position component x,y
          // => factory
        }
      );
    });
    return this.connectedPromise;
  }

  public joinGame(userName: string, roomIndex: number) {
    // Temporary copypaste color randomizer
    const color: string =
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);

    const event: Protocol.IJoinGameEvent = {
      name: userName,
      color,
      room: roomIndex,
    };
    this.channel.emit(Protocol.SOCKET_EVENT.JOIN_GAME, event, {
      reliable: true,
    });
  }

  public requestSpawn() {
    this.channel.emit(
      Protocol.SOCKET_EVENT.SPAWN,
      {},
      {
        reliable: true,
      }
    );
  }
}
