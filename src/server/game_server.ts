import * as express from 'express';
import * as socketIo from 'socket.io';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import { createServer, Server } from 'http';

import * as Constants from '../shared/constants';
import * as webpackConfig from '../../webpack.dev';

export class GameServer {
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;

  constructor() {
    console.log('ctor');
    this._app = express();
    this.port = process.env.PORT || Constants.DEFAULT_PORT;
    this.server = createServer(this._app);
    this.serveIndex();
    this.initSocket();
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

  private initSocket(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(Constants.SOCKET_EVENT.CONNECT, (socket: any) => {
      console.log('Connected client on port %s.', this.port);

      socket.on(Constants.SOCKET_EVENT.DISCONNECT, () => {
        console.log('Client disconnected');
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}
