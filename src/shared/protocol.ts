export enum SOCKET_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  GAME_UPDATE = 'game_update',
  JOIN_GAME = 'join_game',
  JOIN_GAME_RESPONSE = 'join_game_response',
  SPAWN_PLAYER = 'spawn',
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

export interface IComponentChange {
  type: string;
  data: object;
}

export interface IEntityChange {
  entity: string;
  components: IComponentChange[];
}

export interface IGameUpdateEvent {
  entities: IEntityChange[];
}
