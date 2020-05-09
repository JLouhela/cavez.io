import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import { createServer, Server } from 'http';

import * as Constants from '../shared/constants';
import * as webpackConfig from '../../webpack.dev';
import { GameRoom } from './game_room';
import { IPlayer } from './player_interface';

import { ISocketServer } from './socket_server_interface';
import { ISocketServerDep } from './socket_server_dep_interface';
import { IRoomHandler } from './room_handler_interface';

export class GameServer implements ISocketServerDep, IRoomHandler {
  private _app: express.Application;
  private server: Server;
  private socketServer: ISocketServer;
  private port: string | number;
  private rooms: { [index: number]: GameRoom } = {};

  constructor(socketServer: ISocketServer) {
    this._app = express();
    this.port = process.env.PORT || Constants.DEFAULT_PORT;
    this.server = createServer(this._app);
    this.serveIndex();
    this.socketServer = socketServer;
    this.socketServer.init(this, this);
    this.listen();

    // TODO: Let players create rooms, for now just init room 0
    this.rooms[0] = new GameRoom(0, 'Test room');
  }

  private serveIndex(): void {
    if (process.env.NODE_ENV === 'development') {
      // Setup Webpack for development
      const compiler = webpack(webpackConfig.default);
      this._app.use(webpackDevMiddleware(compiler));
    } else {
      // Static serve the dist/ folder in production
      this._app.use(express.static('dist'));
    }
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });
    this.socketServer.registerEvents();
  }

  get app(): express.Application {
    return this._app;
  }

  public getServer(): Server {
    return this.server;
  }

  public addToRoom(player: IPlayer, roomIndex: number) {
    this.rooms[roomIndex].addPlayer(player);
  }
}
