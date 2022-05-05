import * as Protocol from '../../shared/protocol.js';
import * as Constants from '../../shared/constants.js';
import { GameState } from '../game/game_state.js';
import geckos from '@geckos.io/client';
import { ClientWorldManager } from '../client_world_manager.js';
import { ClientLevelManager } from '../client_level_manager.js';
import { ClientChannel } from '@geckos.io/client';

export interface ISocketEmit {
  sendInputState(keyMask: number, id: number): void;
}

export class GeckosSocketHandler implements ISocketEmit {
  private channel: ClientChannel = null;
  private roomId = "";
  private gameState: GameState = null;
  private worldManager: ClientWorldManager = null;
  private levelManager: ClientLevelManager = null;

  constructor(gameState: GameState, levelManager: ClientLevelManager) {
    this.gameState = gameState;
    this.levelManager = levelManager;
  }

  connectedPromise = new Promise<void>((resolve) => {
    this.channel = geckos({ port: Constants.DEFAULT_PORT });

    this.channel.onConnect(() => {
      console.log(`Connected to server, channel id ${this.channel.id}`);
      resolve();
    }).catch((error: Error) => console.error(error.message));
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
          console.log(`Game join ${response.ok ? 'ok' : 'not ok'}`);
          if (!response.ok) {
            console.log('Join game responded with NOK');
            return;
          }
          if (this.roomId !== response.room) {
            console.log(
              `Received join game response for wrong room index, expected
              ${this.roomId} received ${response.room} `);
            this.roomId = "";
            return;
          }
          console.log(`Loading level ${response.level} `);
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
          const timeOffset =
            event.serverTime - performance.now() - roundTripTime / 2;
          this.gameState.setServerTimeOffset(timeOffset);
          console.log(`Ping: ${roundTripTime}, timeOffset = ${timeOffset} `);
        }
      );

      // Game update
      this.channel.on(
        Protocol.SOCKET_EVENT.ENTITY_UPDATE,
        (event: Protocol.IEntityUpdateEvent) => {
          this.gameState.addSyncEvent(event);
        }
      );

      // Input processed serverside
      this.channel.on(
        Protocol.SOCKET_EVENT.INPUT_PROCESSED,
        (event: Protocol.IInputProcessedEvent) => {
          this.gameState.setLastProcessedInput(event);
        }
      );
    }).catch((error: Error) => console.error(error.message));
    return this.connectedPromise;
  }

  public joinGame(userName: string, roomId: string) {
    // Temporary copypaste color randomizer
    const color: string =
      '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
    this.roomId = roomId;
    const joinGameEvent: Protocol.IJoinGameEvent = {
      name: userName,
      color,
      room: roomId,
    };

    const pingEvent: Protocol.IPingEvent = {
      clientTime: performance.now(),
      serverTime: 0,
    };
    this.channel.emit(Protocol.SOCKET_EVENT.PING, pingEvent, { reliable: true });
    this.channel.emit(Protocol.SOCKET_EVENT.JOIN_GAME, joinGameEvent, {
      reliable: true
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

  public sendInputState(keyMask: number, id: number) {
    const event: Protocol.IInputUpdateEvent = {
      timestamp: performance.now(),
      id,
      keyMask,
    };
    this.channel.emit(Protocol.SOCKET_EVENT.INPUT_UPDATE, event, {
      reliable: true,
    });
  }
}
