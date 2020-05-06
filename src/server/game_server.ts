import * as express from 'express';
import * as socketIo from 'socket.io';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import { createServer, Server } from 'http';

import * as Constants from '../shared/constants';
import * as Protocol from '../shared/protocol';
import * as webpackConfig from '../../webpack.dev';
import { GameRoom } from './game_room';

export class GameServer {
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private rooms: { [index: number]: GameRoom } = {};

  constructor() {
    this._app = express();
    this.port = process.env.PORT || Constants.DEFAULT_PORT;
    this.server = createServer(this._app);
    this.serveIndex();
    this.initSocket();
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

  private initSocket(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(Protocol.SOCKET_EVENT.CONNECT, (socket: any) => {
      console.log('Connected client on port %s.', this.port);

      socket.on(Protocol.SOCKET_EVENT.DISCONNECT, () => {
        console.log('Client disconnected');
      });

      socket.on(
        Protocol.SOCKET_EVENT.JOIN_GAME,
        (playerName: string, roomIndex: number) => {
          this.rooms[roomIndex].addPlayer({ name: playerName, socket });
        }
      );
    });
  }

  get app(): express.Application {
    return this._app;
  }
}
