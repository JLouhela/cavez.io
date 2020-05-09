import { GameServer } from './game_server';
import { WebSocketServer } from './websocket_server';

const webSocketServer = new WebSocketServer();
const app = new GameServer(webSocketServer).app;

export { app };
