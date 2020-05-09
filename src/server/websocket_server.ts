import { ISocketServer } from './socket_server_interface';
import { ISocketServerDep } from './socket_server_dep_interface';
import { IRoomHandler } from './room_handler_interface';
import * as socketIo from 'socket.io';
import * as Protocol from '../shared/protocol';

export class WebSocketServer implements ISocketServer {
  private io: SocketIO.Server;
  private roomHandler: IRoomHandler;

  public init(
    dependencyProvider: ISocketServerDep,
    roomHandler: IRoomHandler
  ): void {
    this.io = socketIo(dependencyProvider.getServer());
    this.roomHandler = roomHandler;
  }

  public registerEvents(): void {
    this.io.on(Protocol.SOCKET_EVENT.CONNECT, (socket: any) => {
      console.log('Client connected');

      socket.on(Protocol.SOCKET_EVENT.DISCONNECT, () => {
        console.log('Client disconnected');
      });

      socket.on(
        Protocol.SOCKET_EVENT.JOIN_GAME,
        (playerName: string, playerColor: string, roomIndex: number) => {
          this.roomHandler.addToRoom(
            {
              name: playerName,
              socket,
              color: playerColor,
            },
            roomIndex
          );
        }
      );
    });
  }
}
