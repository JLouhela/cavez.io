import { Server } from 'http';

// Serve dependencies for different socket servers
export interface ISocketServerDep {
  getServer(): Server;
}
