import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics';
import { CPosition } from '../component/cposition';
import { CTerrainCollision } from '../component/cterrain_collision';
import * as CollisionFunc from '../collision/collision_functions';

export class CollisionResolveSystem extends System {
  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
  }

  execute(delta: number, time: number) {
    this.queries.terrainCollisions.added.forEach((entity) => {
      const terrainCollision = entity.getMutableComponent(CTerrainCollision);
      if (!terrainCollision) {
        return;
      }
      CollisionFunc.resolveTerrainCollision(
        entity,
        terrainCollision.localPoint,
        terrainCollision.terrainPoint,
        delta
      );
      entity.removeComponent(CTerrainCollision);
    });
  }
}

CollisionResolveSystem.queries = {
  terrainCollisions: {
    components: [CTerrainCollision, CPosition, CPhysics],
    listen: {
      added: true,
    },
  },
};
