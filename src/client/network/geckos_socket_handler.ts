import * as Protocol from '../../shared/protocol';
import * as Constants from '../../shared/constants';
import geckos from '@geckos.io/client';
import { request } from 'express';

export class GeckosSocketHandler {
  private channel: any = null;
  private roomIndex: number = -1;

  connectedPromise = new Promise((resolve) => {
    this.channel = geckos({ port: Constants.DEFAULT_PORT });

    this.channel.onConnect((error: any) => {
      if (error) {
        console.error(error.message);
        return;
      }
      console.log('Connected to server, channel id ' + this.channel.id);
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

      // Disconnect
      this.channel.onDisconnect(() => {
        console.log('Disconnected from server');
        this.channel = null;
      });

      // Join game
      this.channel.on(
        Protocol.SOCKET_EVENT.JOIN_GAME_RESPONSE,
        (response: Protocol.IJoinGameEventResponse) => {
          console.log('Join ' + response.ok);
          if (!response.ok) {
            console.log('Join game responded with NOK');
            return;
          }
          if (this.roomIndex !== response.room) {
            console.log(
              'Received join game response for wrong room index, expected ' +
                this.roomIndex +
                ', received ' +
                response.room
            );
            this.roomIndex = -1;
            return;
          }
          this.requestSpawn();
        }
      );

      // Game update
      this.channel.on(
        Protocol.SOCKET_EVENT.ENTITY_UPDATE,
        (syncPackets: Protocol.IEntityUpdate) => {
          console.log(syncPackets);
        }
      );
    });
    return this.connectedPromise;
  }

  public joinGame(userName: string, roomIndex: number) {
    // Temporary copypaste color randomizer
    const color: string =
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    this.roomIndex = roomIndex;
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
      Protocol.SOCKET_EVENT.SPAWN_PLAYER,
      {},
      {
        reliable: true,
      }
    );
  }
}
