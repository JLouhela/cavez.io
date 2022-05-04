import { CPosition, IPosition } from '../component/cposition.js';
import { CPlayer, IPlayer } from '../component/cplayer.js';
import { CPhysics, IPhysics } from './cphysics.js';
import { Vec2 } from '../../math/vector.js';

// TODO: make this generic somehow?
// This mess is a combination of
// - frustration on making things run again after npm update
// - lack of typescript knowledge
// - lacking typescript support from ecsy js
export namespace CopyUtils {

  export function copyPosData(src: IPosition, target: CPosition): void {
    target.x = src.x;
    target.y = src.y;
  }

  export function copyPlayerData(src: IPlayer, target: CPlayer): void {
    target.name = src.name;
    target.color = src.color;
  }

  export function copyPhysics(src: IPhysics, target: CPhysics): void {
    target.mass = src.mass;
    target.velocity.copy(src.velocity);
    target.acceleration.copy(src.acceleration);
    target.rotation = src.rotation;
    target.angle = src.angle;
    target.drag = src.drag;
  }
}

