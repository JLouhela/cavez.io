import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics';
import { ILevelProvider } from '../level/level_provider_interface';
import * as CollisionUtils from '../../../shared/game/collision/collision_utils';
import { CTerrainCollider } from '../component/cterrain_collider';
import { Level } from '../level/level';
import { CPosition } from '../component/cposition';
import { Entity } from 'ecsy';
import { IVec2, Vec2 } from '../../../shared/math/vector';
import { CTerrainCollision } from '../component/cterrain_collision';

export class CollisionDetectionSystem extends System {
  private updateAccumulator: number = 0.0;
  private timeStep: number = 1 / 60; // Update ratio: 60fps
  private levelProvider: ILevelProvider = null;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.levelProvider = attributes.levelProvider;
  }

  private fixedUpdate(delta: number) {
    this.updateAccumulator += delta;
    while (this.updateAccumulator >= this.timeStep) {
      this.performUpdate(this.timeStep);
      this.updateAccumulator -= this.timeStep;
    }
  }

  private performUpdate(delta: number) {
    this.queries.terrainColliders.results.forEach((entity) => {
      const level = this.levelProvider.getLevel();
      this.terrainCollisionCheck(entity, level);
    });
  }

  private terrainCollisionCheck(entity: Entity, level: Level) {
    const collider = entity.getComponent(CTerrainCollider);
    const pos = entity.getComponent(CPosition);

    let localCollisionPoint: IVec2 = null;
    let terrainCollisionPoint: IVec2 = null;
    let collision: boolean = false;
    collider.collisionPoints.forEach((point) => {
      const terrainPoint = { x: point.x + pos.x, y: point.y + pos.y };
      if (level.isSolid(terrainPoint)) {
        collision = true;
        localCollisionPoint = point;
        terrainCollisionPoint = terrainPoint;
        return;
      }
    });
    if (collision) {
      this.addTerrainCollisionComponent(
        entity,
        localCollisionPoint,
        terrainCollisionPoint
      );
    }
  }

  private addTerrainCollisionComponent(
    entity: Entity,
    localCollisionPoint: IVec2,
    terrainCollisionPoint: IVec2
  ) {
    // If unresolved collision exists: adapt it
    // TODO: think if this does not make sense
    if (entity.hasComponent(CTerrainCollision)) {
      const comp = entity.getMutableComponent(CTerrainCollision);
      comp.localPoint.set(localCollisionPoint.x, localCollisionPoint.y);
      comp.terrainPoint.set(terrainCollisionPoint.x, terrainCollisionPoint.y);
      return;
    }
    entity.addComponent(CTerrainCollision, {
      localPoint: new Vec2(localCollisionPoint.x, localCollisionPoint.y),
      terrainPoint: new Vec2(terrainCollisionPoint.x, terrainCollisionPoint.y),
    });
  }

  execute(delta: number, time: number) {
    this.fixedUpdate(delta);
  }
}

CollisionDetectionSystem.queries = {
  terrainColliders: {
    components: [CTerrainCollider, CPosition],
  },
};
