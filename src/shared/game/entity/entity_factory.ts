import { World, Entity } from 'ecsy';
import { CPosition } from './../component/cposition.js';
import { CPlayer } from './../component/cplayer.js';
import { IVec2 } from './../../math/vector.js';
import { CNetworkEntity } from '../component/cnetwork_entity.js';
import { CCameraFollow } from '../../../client/game/camera/ccamera_follow.js';
import { CSprite } from '../../../client/rendering/csprite.js';
import { CInput } from '../component/cinput.js';
import { CPhysics } from '../component/cphysics.js';
import { CThrottle } from '../component/cthrottle.js';
import { CSync } from '../component/ctags.js';
import * as Constants from '../../constants.js';
import { IEntitySyncPacket } from '../../../shared/protocol.js';
import { CTerrainCollider } from '../component/cterrain_collider.js';
import { Vec2 } from '../../math/vector.js';
import { CopyUtils } from '../component/copy_utils.js';

// TODO: Clear server / client separation

export class EntityFactory {
  private world: World = null;

  constructor(world: World) {
    this.world = world;
  }

  public createEntity(components: any[]) {
    const entity = this.world.createEntity(null);
    for (const component of components) {
      entity.addComponent(component);
    }
    return entity;
  }

  public createPlayerEntity(name: string, color: string, pos: IVec2): Entity {
    const e = this.createEntity([
      CPlayer,
      CPosition,
      CPhysics,
      CThrottle,
      CSync,
      CTerrainCollider,
    ]);
    const playerComp = e.getMutableComponent(CPlayer);
    playerComp.color = color;
    playerComp.name = name;

    const posComp = e.getMutableComponent(CPosition);
    posComp.x = pos.x;
    posComp.y = pos.y;

    const physComp = e.getMutableComponent(CPhysics);
    const testpaska = new CPhysics();
    console.log(physComp)
    physComp.mass = Constants.SHIP_MASS;

    const angleNorth = 1.5 * Math.PI;
    physComp.angle = angleNorth;

    const collidercomp = e.getMutableComponent(CTerrainCollider);
    const collisionPoints: IVec2[] = [];

    // TODO: Adapt if ship type can be changed, hard coded for the v-wing for now
    collisionPoints.push({ x: 0, y: 0 });
    // TODO enable more collision points when it's time to enhance collision handling
    // Below v-shape points for a ship, 0,0 can be erased.
    // collisionPoints.push({ x: 8, y: 0 });
    // collisionPoints.push({ x: 0, y: 4 });
    // collisionPoints.push({ x: 0, y: -4 });
    // collisionPoints.push({ x: -8, y: 8 });
    // collisionPoints.push({ x: -8, y: -8 });
    collidercomp.collisionPoints = collisionPoints;

    return e;
  }

  public copyPlayerEntity(sync: IEntitySyncPacket): Entity {
    const player = this.createPlayerEntity(
      sync.player.name,
      sync.player.color,
      sync.pos
    );
    let physics = player.getMutableComponent(CPhysics)
    CopyUtils.copyPhysics(sync.physics, physics);
    return player;
  }

  public copyEntity(sync: IEntitySyncPacket) {
    if (sync.player) {
      return this.copyPlayerEntity(sync);
    }
  }

  public copyNetworkEntity(sync: IEntitySyncPacket, serverId: number): Entity {
    const entity = this.copyEntity(sync);
    if (!entity) {
      return null;
    }
    entity.addComponent(CNetworkEntity, {
      serverId,
      clientId: entity.id,
    });
    return entity;
  }

  // For all players
  public addPlayerComponents(playerEntity: Entity, spriteId: number) {
    playerEntity.addComponent(CSprite, {
      spriteId,
      // TODO consider using number everywhere
      hue: parseInt(playerEntity.getComponent(CPlayer).color.substring(1), 16),
    });
  }

  // For client controlled player
  public addClientPlayerComponents(playerEntity: Entity) {
    playerEntity.addComponent(CCameraFollow, {
      cameraId: 1,
    });
    playerEntity.addComponent(CInput);
  }
}
