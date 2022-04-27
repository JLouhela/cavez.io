import { Entity } from 'ecsy';
import { CPosition } from '../component/cposition.js';
import { CPhysics } from '../component/cphysics.js';
import { IVec2 } from '../../math/vector.js';
import * as MathUtils from '../../math/math_utils.js';
import * as Constants from '../../constants.js';
import { CThrottle } from '../component/cthrottle.js';

// Only call from systems! Make sure necessary components are present
export function physicsStep(entity: Entity, delta: number) {
  const physComp = entity.getMutableComponent(CPhysics);
  physComp.angle += physComp.rotation * delta;
  physComp.angle %= 2 * Math.PI;

  const gravitationForce = Constants.GRAVITY * physComp.mass;
  const velocityNormal = physComp.velocity.normal;
  const dragForce = 0.5 * Constants.AIR_DENSITY * physComp.drag;
  const dragVec = {
    x:
      -velocityNormal.x * physComp.velocity.x * physComp.velocity.x * dragForce,
    y:
      -velocityNormal.y * physComp.velocity.y * physComp.velocity.y * dragForce,
  };

  let throttleForce: IVec2 = { x: 0, y: 0 };
  const throttleComp = entity.getComponent(CThrottle);
  if (throttleComp && throttleComp.throttleOn) {
    throttleForce = {
      x: throttleComp.throttlePower * Math.cos(physComp.angle),
      y: throttleComp.throttlePower * Math.sin(physComp.angle),
    };
  }

  physComp.acceleration.set(
    (throttleForce.x + dragVec.x) / physComp.mass,
    (throttleForce.y + gravitationForce + dragVec.y) / physComp.mass
  );

  physComp.velocity.set(
    physComp.velocity.x + physComp.acceleration.x * delta,
    physComp.velocity.y + physComp.acceleration.y * delta
  );

  const posComp = entity.getMutableComponent(CPosition);
  posComp.x = MathUtils.wrap(
    posComp.x + physComp.velocity.x * delta,
    Constants.WORLD_BOUNDS.x
  );
  posComp.y = MathUtils.wrap(
    posComp.y + physComp.velocity.y * delta,
    Constants.WORLD_BOUNDS.y
  );
}
