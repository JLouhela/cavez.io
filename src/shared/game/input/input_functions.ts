import { Entity } from 'ecsy';
import { CPhysics } from '../component/cphysics.js';
import { CThrottle } from '../component/cthrottle.js';
import * as Constants from '../../constants.js';
import * as Protocol from '../../protocol.js';

export function executeInput(entity: Entity, keyMask: number) {
  const physics = entity.getMutableComponent(CPhysics);
  const throttle = entity.getMutableComponent(CThrottle);

  updateRotation(physics, keyMask);
  updateThrottle(throttle, physics.mass, keyMask);
}

function updateRotation(physics: CPhysics, keyMask: number) {
  let dir = 0;
  if ((keyMask & Protocol.INPUT_MASK.ROT_CW) > 0) {
    dir = 1;
  }
  if ((keyMask & Protocol.INPUT_MASK.ROT_CCW) > 0) {
    dir -= 1;
  }
  physics.rotation =
    ((dir * physics.mass) / Constants.SHIP_ROTATION_PER_MASS_INVERSE) * Math.PI;
}

function updateThrottle(throttle: CThrottle, mass: number, keyMask: number) {
  throttle.throttleOn = (keyMask & Protocol.INPUT_MASK.THROTTLE) > 0;
  throttle.throttlePower = Constants.SHIP_THROTTLE_PER_MASS / mass;
}
