export enum SOCKET_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  GAME_UPDATE = 'game_update',
  JOIN_GAME = 'join_game',
}

export interface IJoinGameEvent {
  name: string;
  color: string;
  room: number;
}
