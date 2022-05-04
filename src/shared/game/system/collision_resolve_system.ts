import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics.js';
import { CPosition } from '../component/cposition.js';
import { CTerrainCollision } from '../component/cterrain_collision.js';
import { World, Attributes, Entity } from 'ecsy';
import * as CollisionFunc from '../collision/collision_functions.js';

export class CollisionResolveSystem extends System {

  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
  }

  execute(delta: number, _: number) {
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
