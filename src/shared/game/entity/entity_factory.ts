import { World, Entity } from 'ecsy';
import { CPosition } from './../component/cposition';
import { CPlayer } from './../component/cplayer';
import { IVec2 } from './../../math/vector';
import { CNetworkSync } from '../component/cnetwork_sync';
import { CNetworkEntity } from '../component/cnetwork_entity';
import { CCameraFollow } from '../component/ccamera_follow';
import { CSprite } from '../component/csprite';
import { CInput } from '../component/cinput';
import { CPhysics } from '../component/cphysics';
import { CThrottle } from '../component/cthrottle';
import { CSync } from '../component/ctags';
import * as Constants from '../../constants';

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
    ]);
    let playerComp = e.getMutableComponent(CPlayer);
    playerComp.color = color;
    playerComp.name = name;

    let posComp = e.getMutableComponent(CPosition);
    posComp.x = pos.x;
    posComp.y = pos.y;

    let physComp = e.getMutableComponent(CPhysics);
    physComp.mass = Constants.SHIP_MASS;

    const angleNorth = Math.PI + Math.PI / 2;
    physComp.angle = angleNorth;

    return e;
  }

  public copyPlayerEntity(syncComp: CNetworkSync): Entity {
    const player = this.createPlayerEntity(
      syncComp.player.name,
      syncComp.player.color,
      syncComp.pos
    );
    player.getMutableComponent(CPhysics).copy(syncComp.physics);
    return player;
  }

  public copyEntity(syncComp: CNetworkSync) {
    if (syncComp.player) {
      return this.copyPlayerEntity(syncComp);
    }
  }

  public copyNetworkEntity(syncComp: CNetworkSync, serverId: number): Entity {
    const entity = this.copyEntity(syncComp);
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
      followEntityId: playerEntity.id,
    });
    playerEntity.addComponent(CInput);
  }
}
