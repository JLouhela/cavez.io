import { System, Entity } from 'ecsy';
import { CThrottle } from '../component/cthrottle';
import { CPosition } from '../component/cposition';
import { CPhysics } from '../component/cphysics';
import * as Constants from '../../constants';
import { Vec2, IVec2 } from '../../math/vector';

export class PhysicsSystem extends System {
  execute(delta: number, time: number) {
    this.queries.all.results.forEach((entity) => {
      const physComp = entity.getMutableComponent(CPhysics);

      const gravitationForce = Constants.GRAVITY * physComp.mass;
      const velocityNormal = physComp.velocity.normal;
      const dragForce = 0.5 * Constants.AIR_DENSITY * physComp.drag;
      const dragVec = {
        x:
          -velocityNormal.x *
          physComp.velocity.x *
          physComp.velocity.x *
          dragForce,
        y:
          -velocityNormal.y *
          physComp.velocity.y *
          physComp.velocity.y *
          dragForce,
      };

      let throttleForce: IVec2 = { x: 0, y: 0 };

      if (
        entity.getComponent(CThrottle) &&
        entity.getComponent(CThrottle).throttleOn
      ) {
        throttleForce = entity.getComponent(CThrottle).throttleForce;
      }

      physComp.acceleration = new Vec2(
        (throttleForce.x - dragVec.x) / physComp.mass,
        (throttleForce.y - (gravitationForce + dragVec.y)) / physComp.mass
      );

      physComp.velocity = new Vec2(
        physComp.velocity.x + physComp.acceleration.x * delta,
        physComp.velocity.y + physComp.acceleration.y * delta
      );

      const posComp = entity.getMutableComponent(CPosition);
      posComp.x += physComp.velocity.x * delta;
      posComp.y += physComp.velocity.y * delta;
    });
  }
}

PhysicsSystem.queries = {
  all: {
    components: [CPosition, CPhysics],
  },
};
