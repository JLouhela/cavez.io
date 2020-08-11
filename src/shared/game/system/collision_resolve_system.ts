import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics';
import * as CollisionUtils from '../collision/collision_utils';
import { Level } from '../level/level';
import { CPosition } from '../component/cposition';
import { Entity } from 'ecsy';
import { IVec2 } from '../../math/vector';
import { CTerrainCollision } from '../component/cterrain_collision';

export class CollisionResolveSystem extends System {
  private updateAccumulator: number = 0.0;
  private timeStep: number = 1 / 60; // Update ratio: 60fps

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
  }

  private fixedUpdate(delta: number) {
    this.updateAccumulator += delta;
    while (this.updateAccumulator >= this.timeStep) {
      this.performUpdate(this.timeStep);
      this.updateAccumulator -= this.timeStep;
    }
  }

  private performUpdate(delta: number) {
    this.queries.terrainCollisions.results.forEach((entity) => {
      this.resolveTerrainCollision(entity);
    });
  }

  private resolveTerrainCollision(entity: Entity) {
    const collision = entity.getComponent(CTerrainCollision);
    const pos = entity.getMutableComponent(CPosition);
    const phys = entity.getMutableComponent(CPhysics);
    console.log(
      'Collision: local' + collision.localPointX + ',' + collision.localPointY
    );
    console.log(
      'Collision: terrain ' +
        collision.terrainPointX +
        ', ' +
        collision.terrainPointY
    );
    entity.removeComponent(CTerrainCollision);
  }

  execute(delta: number, time: number) {
    this.fixedUpdate(delta);
  }
}

CollisionResolveSystem.queries = {
  terrainCollisions: {
    components: [CTerrainCollision, CPosition, CPhysics],
  },
};
