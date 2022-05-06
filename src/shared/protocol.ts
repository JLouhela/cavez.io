import { IPosition } from './game/component/cposition.js';
import { IPlayer } from './game/component/cplayer.js';
import { IPhysics } from './game/component/cphysics.js';

export enum SOCKET_EVENT {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  JOIN_GAME = 'join_game',
  JOIN_GAME_RESPONSE = 'join_game_response',
  SPAWN_PLAYER = 'spawn',
  ENTITY_UPDATE = 'entity_update',
  INPUT_UPDATE = 'input_update',
  PING = 'ping',
  PING_RESPONSE = 'ping_response',
  INPUT_PROCESSED = 'input_processed',
}

export enum INPUT_MASK {
  THROTTLE = 0x01,
  ROT_CW = 0x02,
  ROT_CCW = 0x04,
}

export interface IEntitySyncPacket {
  pos: IPosition;
  player: IPlayer;
  physics: IPhysics;
  timestamp: number;
}

export type IEntityUpdate = { [id: number]: IEntitySyncPacket };

export interface IEntityUpdateEvent {
  timestamp: number;
  entityUpdates: IEntityUpdate;
}

export interface IInputUpdateEvent {
  timestamp: number;
  id: number;
  keyMask: number;
}

export interface IInputProcessedEvent {
  id: number;
}

export interface IJoinGameEvent {
  name: string;
  color: string;
  room: string;
}

export interface IJoinGameEventResponse {
  ok: boolean;
  room: string;
  level: string;
}

export interface IPingEvent {
  clientTime: number;
  serverTime: number;
}
