import { ServerChannel } from '@geckos.io/server';

export interface IServerPlayer {
  socket: ServerChannel;
  name: string;
  color: string;
}
