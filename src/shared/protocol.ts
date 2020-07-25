import { CNetworkSync } from './game/component/cnetwork_sync';

export enum SOCKET_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN_GAME = 'join_game',
  JOIN_GAME_RESPONSE = 'join_game_response',
  SPAWN_PLAYER = 'spawn',
  ENTITY_UPDATE = 'entity_update',
  INPUT_UPDATE = 'input_update',
}

export enum INPUT_MASK {
  THROTTLE = 0x01,
  ROT_CW = 0x02,
  ROT_CCW = 0x04,
}

export type IEntityUpdate = { [id: number]: CNetworkSync };

export interface IEntityUpdateEvent {
  timestamp: number;
  entityUpdates: IEntityUpdate;
}

export interface IInputUpdateEvent {
  timestamp: number;
  keyMask: number;
}

export interface IJoinGameEvent {
  name: string;
  color: string;
  room: number;
}

export interface IJoinGameEventResponse {
  ok: boolean;
  room: number;
  level: string;
}
