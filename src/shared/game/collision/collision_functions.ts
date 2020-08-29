import { CollisionMaskType } from './collision_mask_types';
import { Entity } from 'ecsy';
import { Level } from '../level/level';
import { CTerrainCollider } from '../component/cterrain_collider';
import { CPosition } from '../component/cposition';
import { CPhysics } from '../component/cphysics';
import { IVec2, Vec2 } from '../../../shared/math/vector';
import * as MathUtils from '../../../shared/math/math_utils';
import { CTerrainCollision } from '../component/cterrain_collision';

export function collidesWith(
  mask: number,
  collisionType: CollisionMaskType
): boolean {
  return (mask & collisionType) > 0;
}

function addTerrainCollisionComponent(
  entity: Entity,
  localCollisionPoint: IVec2,
  terrainCollisionPoint: IVec2
) {
  if (entity.hasComponent(CTerrainCollision)) {
    console.log(
      'Entity ' + entity.id + ' has already unresolved terrain collision!'
    );
    return;
  }
  entity.addComponent(CTerrainCollision, {
    localPoint: new Vec2(localCollisionPoint.x, localCollisionPoint.y),
    terrainPoint: new Vec2(terrainCollisionPoint.x, terrainCollisionPoint.y),
  });
}

// Call only from systems!
export function terrainCollisionCheck(entity: Entity, level: Level) {
  const collider = entity.getComponent(CTerrainCollider);
  const pos = entity.getComponent(CPosition);
  const phys = entity.getComponent(CPhysics);

  let localCollisionPoint: IVec2 = null;
  let terrainCollisionPoint: IVec2 = null;
  let collision: boolean = false;
  collider.collisionPoints.forEach((point) => {
    const rotatedCollisionPoint = MathUtils.rotatePoint(point, phys.angle);
    const terrainPoint = {
      x: rotatedCollisionPoint.x + pos.x,
      y: rotatedCollisionPoint.y + pos.y,
    };
    if (level.isSolid(terrainPoint)) {
      collision = true;
      localCollisionPoint = point;
      terrainCollisionPoint = terrainPoint;
      return;
    }
  });
  if (collision) {
    addTerrainCollisionComponent(
      entity,
      localCollisionPoint,
      terrainCollisionPoint
    );
  }
}

export function resolveTerrainCollision(entity: Entity, delta: number) {
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
