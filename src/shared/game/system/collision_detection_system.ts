import { System } from 'ecsy';
import { CPhysics } from '../component/cphysics';
import { ILevelProvider } from '../level/level_provider_interface';
import * as CollisionUtils from '../../../shared/game/collision/collision_utils';
import { CTerrainCollider } from '../component/cterraincollider';
import { Level } from '../level/level';
import { CPosition } from '../component/cposition';

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
      const collider = entity.getComponent(CTerrainCollider);
      const posComp = entity.getComponent(CPosition);
      const level = this.levelProvider.getLevel();
      this.terrainCollisionCheck(posComp, collider, level);
    });
  }

  private pask = 0;
  private terrainCollisionCheck(
    pos: CPosition,
    terrainCollider: CTerrainCollider,
    level: Level
  ) {
    let collision: boolean = false;
    terrainCollider.collisionPoints.forEach((point) => {
      if (level.isSolid({ x: point.x + pos.x, y: point.y + pos.y })) {
        collision = true;
        console.log('COLLISION ' + this.pask++);
        return;
      }
    });
  }

  execute(delta: number, time: number) {
    this.fixedUpdate(delta);
  }
}

CollisionDetectionSystem.queries = {
  terrainColliders: {
    components: [CTerrainCollider, CPhysics],
  },
};
