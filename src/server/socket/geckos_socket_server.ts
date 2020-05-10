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

      // TODO if this works: define msg struct in protocol.ts
      channel.on(Protocol.SOCKET_EVENT.JOIN_GAME, (data: any) => {
        console.log(`got ${data} from "chat message"`);
        this.roomManager.addToRoom(
          {
            name: data.name,
            socket: channel,
            color: data.color,
          },
          data.room
        );
      });
    });
  }
}
