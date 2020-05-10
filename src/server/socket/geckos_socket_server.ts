import { IRoomManager } from '../room/room_manager';
import geckos, { GeckosServer, iceServers } from '@geckos.io/server';
import { Server } from 'http';
import * as Protocol from '../../shared/protocol';

export class GeckosSocketServer {
  private io: GeckosServer;
  private roomManager: IRoomManager;

  constructor(roomManager: IRoomManager, server: Server) {
    // TODO check & study ice
    this.io = geckos({ iceServers });
    this.io.addServer(server);
    this.roomManager = roomManager;
  }

  public registerEvents(): void {
    this.io.onConnection((channel) => {
      channel.onDisconnect(() => {
        console.log(`${channel.id} disconnected`);
      });

      channel.on(
        Protocol.SOCKET_EVENT.JOIN_GAME,
        (event: Protocol.IJoinGameEvent) => {
          this.roomManager.addToRoom(
            {
              name: event.name,
              socket: channel,
              color: event.color,
            },
            event.room
          );
        }
      );
    });
  }
}
