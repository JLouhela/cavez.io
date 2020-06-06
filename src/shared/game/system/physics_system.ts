import { System, Entity } from 'ecsy';
import { CThrottle } from '../component/cthrottle';
import { CPosition } from '../component/cposition';
import { CPhysics } from '../component/cphysics';
import * as Constants from '../../constants';
import { Vec2, IVec2 } from '../../math/vector';

export class PhysicsSystem extends System {
  private worldBounds: IVec2 = null;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.worldBounds = attributes.worldBounds;
  }

  execute(delta: number, time: number) {
    this.queries.all.results.forEach((entity) => {
      const physComp = entity.getMutableComponent(CPhysics);

      physComp.angle += physComp.rotation;
      physComp.angle %= 2 * Math.PI;

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
      const throttleComp = entity.getComponent(CThrottle);
      if (throttleComp && throttleComp.throttleOn) {
        throttleForce = {
          x: throttleComp.throttlePower * Math.cos(physComp.angle),
          y: throttleComp.throttlePower * Math.sin(physComp.angle),
        };
      }

      physComp.acceleration = new Vec2(
        (throttleForce.x + dragVec.x) / physComp.mass,
        (throttleForce.y + gravitationForce + dragVec.y) / physComp.mass
      );

      physComp.velocity = new Vec2(
        physComp.velocity.x + physComp.acceleration.x * delta,
        physComp.velocity.y + physComp.acceleration.y * delta
      );

      const posComp = entity.getMutableComponent(CPosition);
      posComp.x += physComp.velocity.x * delta;
      posComp.y += physComp.velocity.y * delta;

      // TODO: wrap screen properly
      if (this.worldBounds) {
        posComp.x %= this.worldBounds.x;
        posComp.y %= this.worldBounds.y;
        if (posComp.y < 0) {
          posComp.y += this.worldBounds.y;
        }
        if (posComp.x < 0) {
          posComp.x += this.worldBounds.x;
        }
      }
    });
  }
}

PhysicsSystem.queries = {
  all: {
    components: [CPosition, CPhysics],
  },
};
