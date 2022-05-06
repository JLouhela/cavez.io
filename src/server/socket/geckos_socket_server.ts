import { IRoomManager } from '../room/room_manager.js';
import { geckos, GeckosServer, iceServers, ServerChannel } from '@geckos.io/server';
import { Server } from 'http';
import * as Protocol from '../../shared/protocol.js';
import { performance } from 'perf_hooks';

export class GeckosSocketServer {
  private io: GeckosServer;
  private roomManager: IRoomManager;

  constructor(server: Server) {
    // TODO check & study ice
    console.log(iceServers);
    this.io = geckos({
      iceServers,
      portRange: {
        min: 19900,
        max: 20000,
      },
    });
    this.io.addServer(server);
  }

  public getIO(): GeckosServer {
    return this.io;
  }

  public setRoomManager(roomManager: IRoomManager): void {
    this.roomManager = roomManager;
  }

  public registerEvents(): void {
    this.io.onConnection((channel: ServerChannel) => {
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
              level: this.roomManager.getLevel(event.room),
            };
            channel.emit(Protocol.SOCKET_EVENT.JOIN_GAME_RESPONSE, response);
          }
        }
      );

      channel.on(Protocol.SOCKET_EVENT.SPAWN_PLAYER, () => {
        const room = this.roomManager.getRoom(channel.roomId);
        room.spawnPlayer(channel.id);
      });

      channel.on(
        Protocol.SOCKET_EVENT.INPUT_UPDATE,
        (event: Protocol.IInputUpdateEvent) => {
          const room = this.roomManager.getRoom(channel.roomId);
          room.addInputUpdate(channel.id, event);
        }
      );
      channel.on(Protocol.SOCKET_EVENT.PING, (event: Protocol.IPingEvent) => {
        event.serverTime = performance.now();
        channel.emit(Protocol.SOCKET_EVENT.PING_RESPONSE, event);
      });
    });
  }
}
