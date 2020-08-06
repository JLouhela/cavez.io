import { World, Entity } from 'ecsy';
import { CPosition } from './../component/cposition';
import { CPlayer } from './../component/cplayer';
import { IVec2 } from './../../math/vector';
import { CNetworkEntity } from '../component/cnetwork_entity';
import { CCameraFollow } from '../../../client/game/camera/ccamera_follow';
import { CSprite } from '../../../client/rendering/csprite';
import { CInput } from '../component/cinput';
import { CPhysics } from '../component/cphysics';
import { CThrottle } from '../component/cthrottle';
import { CSync } from '../component/ctags';
import * as Constants from '../../constants';
import { IEntitySyncPacket } from '../../../shared/protocol';
import { CCollider } from '../component/ccollider';
import { CollisionType } from '../collision/collision_type';

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
      CCollider,
    ]);
    const playerComp = e.getMutableComponent(CPlayer);
    playerComp.color = color;
    playerComp.name = name;

    const posComp = e.getMutableComponent(CPosition);
    posComp.x = pos.x;
    posComp.y = pos.y;

    const physComp = e.getMutableComponent(CPhysics);
    physComp.mass = Constants.SHIP_MASS;

    const angleNorth = 1.5 * Math.PI;
    physComp.angle = angleNorth;

    let collidercomp = e.getMutableComponent(CCollider);
    collidercomp.collisionMask = CollisionType.Terrain + CollisionType.Bullet;

    return e;
  }

  public copyPlayerEntity(sync: IEntitySyncPacket): Entity {
    const player = this.createPlayerEntity(
      sync.player.name,
      sync.player.color,
      sync.pos
    );
    player.getMutableComponent(CPhysics).copy(sync.physics);
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
