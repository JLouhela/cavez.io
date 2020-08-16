import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics';
import { CPosition } from '../component/cposition';
import { Entity } from 'ecsy';
import { CTerrainCollision } from '../component/cterrain_collision';

export class CollisionResolveSystem extends System {
  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
  }

  execute(delta: number, time: number) {
    this.queries.terrainCollisions.results.forEach((entity) => {
      this.resolveTerrainCollision(entity, delta);
    });
  }

  private resolveTerrainCollision(entity: Entity, delta: number) {
    const pos = entity.getMutableComponent(CPosition);
    const phys = entity.getMutableComponent(CPhysics);

    // TODO Handle collisions properly
    // -> Angular velocity not handled
    // -> Impact point not taken into account
    // -> Pretty much works only with a single point collision, otherwise you can get stuck by rotating
    pos.x -= phys.velocity.x * 1.5 * delta;
    pos.y -= phys.velocity.y * 1.5 * delta;
    phys.velocity.set(0, 0);
    entity.removeComponent(CTerrainCollision);
  }
}

CollisionResolveSystem.queries = {
  terrainCollisions: {
    components: [CTerrainCollision, CPosition, CPhysics],
  },
};
