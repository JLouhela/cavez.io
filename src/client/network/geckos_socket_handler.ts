import * as Protocol from '../../shared/protocol';
import * as Constants from '../../shared/constants';
import { GameState } from '../game/game_state';
import geckos from '@geckos.io/client';

export class GeckosSocketHandler {
  private channel: any = null;
  private roomIndex: number = -1;
  private gameState: GameState = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

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
        (event: Protocol.IEntityUpdateEvent) => {
          this.gameState.addSyncEvent(event);
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
