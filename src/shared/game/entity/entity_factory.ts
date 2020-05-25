import { World, Entity } from 'ecsy';
import { CPosition } from './../component/cposition';
import { CPlayer } from './../component/cplayer';
import { Vec2 } from './../../math/vector';
import { CNetworkSync } from '../component/cnetwork_sync';
import { CNetworkEntity } from '../component/cnetwork_entity';

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

  public createPlayerEntity(name: string, color: string, pos: Vec2): Entity {
    const e = this.createEntity([CPlayer, CPosition]);
    e.getMutableComponent(CPlayer).color = color;
    e.getMutableComponent(CPlayer).name = name;
    e.getMutableComponent(CPosition).x = pos.x;
    e.getMutableComponent(CPosition).y = pos.y;
    return e;
  }

  public copyPlayerEntity(playerComp: CPlayer, posComp: CPosition): Entity {
    return this.createPlayerEntity(playerComp.name, playerComp.color, posComp);
  }

  public copyEntity(syncComp: CNetworkSync) {
    if (syncComp.player) {
      return this.copyPlayerEntity(syncComp.player, syncComp.pos);
    }
  }

  public copyNetworkEntity(syncComp: CNetworkSync, serverId: number): Entity {
    const entity = this.copyEntity(syncComp);
    if (!entity) {
      return null;
    }
    entity.addComponent(CNetworkSync, syncComp);
    entity.addComponent(CNetworkEntity, {
      serverId,
      clientId: entity.id,
    });
    return entity;
  }
}
