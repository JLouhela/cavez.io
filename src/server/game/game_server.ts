import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { createServer, Server } from 'http';

import * as Constants from '../../shared/constants.js';
import * as webpackConfig from '../../../webpack.dev.js';

import { RoomManager } from '../room/room_manager.js';
import { GeckosSocketServer } from '../socket/geckos_socket_server.js';
import { GeckosSocketEmit } from '../socket/geckos_socket_emit.js';
import * as url from 'url';

const dirName = url.fileURLToPath(new URL('.', import.meta.url));

export class GameServer {
  private _app: express.Application;
  private server: Server;
  private socketServer: GeckosSocketServer;
  private socketEmit: GeckosSocketEmit;
  private port: string | number;
  private roomManager: RoomManager;

  constructor() {
    this._app = express();
    this.port = Constants.DEFAULT_PORT;
    this.server = createServer(this._app);
    this.serveIndex();

    this.socketServer = new GeckosSocketServer(this.server);
    this.socketEmit = new GeckosSocketEmit(this.socketServer.getIO());
    this.roomManager = new RoomManager(1, 10, this.socketEmit);

    this.socketServer.setRoomManager(this.roomManager);
    this.listen();
  }

  private serveIndex(): void {
    if (process.env.NODE_ENV === 'development') {
      // Setup Webpack for development
      const compiler = webpack(webpackConfig.default);
      this._app.use(webpackDevMiddleware(compiler));
    } else {
      // Static serve the dist/ folder in production
      this._app.use(express.static(dirName + '/../../../dist'));
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
