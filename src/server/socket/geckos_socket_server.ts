import { IRoomManager } from '../room/room_manager';
import geckos, { GeckosServer, iceServers } from '@geckos.io/server';
import { Server } from 'http';
import * as Protocol from '../../shared/protocol';
import { Game } from '../game';

export class GeckosSocketServer {
  private io: GeckosServer;
  private roomManager: IRoomManager;
  private game: Game;

  constructor(roomManager: IRoomManager, server: Server, game: Game) {
    // TODO check & study ice
    console.log(iceServers);
    this.io = geckos({ iceServers });
    this.io.addServer(server);
    this.roomManager = roomManager;
    this.game = game;
  }

  public registerEvents(): void {
    this.io.onConnection((channel) => {
      channel.onDisconnect(() => {
        this.roomManager.removeFromRoom(channel);
        console.log(`${channel.id} disconnected`);
      });

      channel.on(
        Protocol.SOCKET_EVENT.JOIN_GAME,
        (event: Protocol.IJoinGameEvent) => {
          const ok = this.roomManager.addToRoom(
            {
              name: event.name,
              socket: channel,
              color: event.color,
            },
            event.room
          );
          if (ok) {
            // TODO add player id
            const response: Protocol.IJoinGameEventResponse = {
              ok,
              room: event.room,
            };
            channel.emit(Protocol.SOCKET_EVENT.JOIN_GAME_RESPONSE, response);
          }
        }
      );

      channel.on(Protocol.SOCKET_EVENT.SPAWN_PLAYER, () => {
        // TODO query for spawnpoint
        const spawnPoint = { x: 50, y: 50 };
        // TODO instead of coordinates, just spawn an entity and send it's data
        // Player has it's id -> CPlayer
      });
    });
  }
}
