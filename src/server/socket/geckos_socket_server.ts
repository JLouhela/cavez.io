import { IRoomManager } from '../room/room_manager';
import geckos, { GeckosServer, iceServers } from '@geckos.io/server';
import { Server } from 'http';
import * as Protocol from '../../shared/protocol';
import { Game } from '../game/game';

export class GeckosSocketServer {
  private io: GeckosServer;
  private roomManager: IRoomManager;
  private game: Game;

  constructor(roomManager: IRoomManager, server: Server) {
    // TODO check & study ice
    console.log(iceServers);
    this.io = geckos({ iceServers });
    this.io.addServer(server);
    this.roomManager = roomManager;
  }

  public getIO(): GeckosServer {
    return this.io;
  }

  public setGame(game: Game): void {
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
            const response: Protocol.IJoinGameEventResponse = {
              ok,
              room: event.room,
            };
            channel.emit(Protocol.SOCKET_EVENT.JOIN_GAME_RESPONSE, response);
          }
        }
      );

      channel.on(Protocol.SOCKET_EVENT.SPAWN_PLAYER, () => {
        this.game.spawnPlayer(channel.id, channel.roomId);
      });
    });
  }
}
