import * as Protocol from '../../shared/protocol';
import * as Constants from '../../shared/constants';
import { GameState } from '../game/game_state';
import geckos from '@geckos.io/client';
import { ClientWorldManager } from '../client_world_manager';
import { ClientLevelManager } from '../client_level_manager';

export interface ISocketEmit {
  sendInputState(keyMask: number): void;
}

export class GeckosSocketHandler implements ISocketEmit {
  private channel: any = null;
  private roomIndex: number = -1;
  private gameState: GameState = null;
  private worldManager: ClientWorldManager = null;
  private levelManager: ClientLevelManager = null;

  constructor(gameState: GameState, levelManager: ClientLevelManager) {
    this.gameState = gameState;
    this.levelManager = levelManager;
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

  public connect(worldManager: ClientWorldManager) {
    this.worldManager = worldManager;
    this.connectedPromise.then(() => {
      // Register callbacks:

      // Disconnect
      this.channel.onDisconnect(() => {
        console.log('Disconnected from server');
        this.worldManager.stop();
        this.channel = null;
      });

      // Join game
      this.channel.on(
        Protocol.SOCKET_EVENT.JOIN_GAME_RESPONSE,
        (response: Protocol.IJoinGameEventResponse) => {
          console.log('Game join ' + response.ok ? 'ok' : 'not ok');
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
          console.log('Loading level ' + response.level);
          this.levelManager.loadLevel(response.level);
          console.log('Starting world');
          this.worldManager.start();
          console.log('Requesting spawn point');
          this.requestSpawn();
        }
      );

      // Ping pong: get server time offset
      this.channel.on(
        Protocol.SOCKET_EVENT.PING_RESPONSE,
        (event: Protocol.IPingEvent) => {
          const roundTripTime = performance.now() - event.clientTime;
          this.gameState.setServerTimeOffset(
            event.serverTime - event.clientTime - roundTripTime / 2
          );
          console.log(
            'Ping: ' +
              roundTripTime +
              ', timeOffset = ' +
              this.gameState.getServerTimeOffset()
          );
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
    const joinGameEvent: Protocol.IJoinGameEvent = {
      name: userName,
      color,
      room: roomIndex,
    };

    const pingEvent: Protocol.IPingEvent = {
      clientTime: performance.now(),
      serverTime: 0,
    };
    this.channel.emit(Protocol.SOCKET_EVENT.PING, pingEvent);
    this.channel.emit(Protocol.SOCKET_EVENT.JOIN_GAME, joinGameEvent, {
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

  public sendInputState(keyMask: number) {
    const event: Protocol.IInputUpdateEvent = {
      timestamp: performance.now(),
      keyMask,
    };

    this.channel.emit(Protocol.SOCKET_EVENT.INPUT_UPDATE, event, {
      reliable: true,
    });
  }
}
