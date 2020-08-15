import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics';
import * as CollisionUtils from '../collision/collision_utils';
import { Level } from '../level/level';
import { CPosition } from '../component/cposition';
import { Entity } from 'ecsy';
import { IVec2 } from '../../math/vector';
import { CTerrainCollision } from '../component/cterrain_collision';

export class CollisionResolveSystem extends System {
  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
  }

  execute(delta: number, time: number) {
    this.queries.terrainCollisions.results.forEach((entity) => {
      this.resolveTerrainCollision(entity);
    });
  }

  private resolveTerrainCollision(entity: Entity) {
    const collision = entity.getComponent(CTerrainCollision);
    const pos = entity.getMutableComponent(CPosition);
    const phys = entity.getMutableComponent(CPhysics);
    console.log(
      'Collision: local' + collision.localPoint.x + ',' + collision.localPoint.y
    );
    console.log(
      'Collision: terrain ' +
        collision.terrainPoint.x +
        ', ' +
        collision.terrainPoint.y
    );
    entity.removeComponent(CTerrainCollision);
  }
}

CollisionResolveSystem.queries = {
  terrainCollisions: {
    components: [CTerrainCollision, CPosition, CPhysics],
  },
};
