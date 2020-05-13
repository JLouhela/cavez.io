export enum SOCKET_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  GAME_UPDATE = 'game_update',
  JOIN_GAME = 'join_game',
  JOIN_GAME_RESPONSE = 'join_game_response',
  SPAWN = 'spawn',
  SPAWN_RESPONSE = 'spawn_response',
}

export interface IJoinGameEvent {
  name: string;
  color: string;
  room: number;
}

export interface IJoinGameEventResponse {
  ok: boolean;
  room: number;
}

export interface ISpawnResponse {
  x: number;
  y: number;
}
