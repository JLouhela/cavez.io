import { CPosition, IPosition } from '../component/cposition.js';
import { CPlayer, IPlayer } from '../component/cplayer.js';
import { CPhysics, IPhysics } from './cphysics.js';

// TODO: make this generic somehow?
// This mess is a combination of
// - frustration on making things run again after npm update
// - lack of typescript knowledge
// - lacking typescript support from ecsy js

export const copyPosData = (src: IPosition, target: CPosition): void => {
  target.x = src.x;
  target.y = src.y;
}

export const copyPlayerData = (src: IPlayer, target: CPlayer): void => {
  target.name = src.name;
  target.color = src.color;
}

export const copyPhysicsData = (src: IPhysics, target: CPhysics): void => {
  target.mass = src.mass;
  target.velocity.copy(src.velocity);
  target.acceleration.copy(src.acceleration);
  target.rotation = src.rotation;
  target.angle = src.angle;
  target.drag = src.drag;
}

// TODO consider naming at least better
export const copyIPosition = (src: CPosition, target: IPosition): void => {
  target.x = src.x;
  target.y = src.y;
}

export const copyIPlayer = (src: CPlayer, target: IPlayer): void => {
  target.name = src.name;
  target.color = src.color;
}

export const copyIPhysics = (src: CPhysics, target: IPhysics): void => {
  target.mass = src.mass;
  target.velocity.copy(src.velocity);
  target.acceleration.copy(src.acceleration);
  target.rotation = src.rotation;
  target.angle = src.angle;
  target.drag = src.drag;
}