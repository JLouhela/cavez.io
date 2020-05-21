import * as express from 'express';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import { createServer, Server } from 'http';

import * as Constants from '../../shared/constants';
import * as webpackConfig from '../../../webpack.dev';

import { RoomManager } from '../room/room_manager';
import { GeckosSocketServer } from '../socket/geckos_socket_server';
import { Game } from './game';
import { GeckosSocketEmit } from '../socket/geckos_socket_emit';
import { ServerWorldManager } from './server_world_manager';

export class GameServer {
  private _app: express.Application;
  private server: Server;
  private socketServer: GeckosSocketServer;
  private socketEmit: GeckosSocketEmit;
  private port: string | number;
  private roomManager: RoomManager;
  private game: Game;
  private worldManager: ServerWorldManager;

  constructor() {
    this._app = express();
    this.port = Constants.DEFAULT_PORT;
    this.server = createServer(this._app);
    this.roomManager = new RoomManager(1, 10);
    this.serveIndex();

    this.socketServer = new GeckosSocketServer(this.roomManager, this.server);

    this.socketEmit = new GeckosSocketEmit(
      this.roomManager,
      this.socketServer.getIO()
    );

    this.worldManager = new ServerWorldManager(this.socketEmit);
    this.game = new Game(this.roomManager, this.worldManager);

    // Cyclic depdency, as the socket emiter depends on socketserver
    // socket server depends on game, and game depends on socket emiter.
    // TODO: Fix when inputs are being handled, need proxy between game and socket.
    this.socketServer.setGame(this.game);
    this.listen();
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
}
