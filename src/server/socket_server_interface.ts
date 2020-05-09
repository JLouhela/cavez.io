import { ISocketServerDep } from './socket_server_dep_interface';
import { IRoomHandler } from './room_handler_interface';

export interface ISocketServer {
  init(dependencyProvider: ISocketServerDep, roomHandler: IRoomHandler): void;
  registerEvents(): void;
}
