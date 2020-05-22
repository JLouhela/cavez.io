import { World } from 'ecsy';
import { CPosition } from './../component/cposition';
import { CPlayer } from './../component/cplayer';
import { Vec2 } from './../../math/vector';

export class EntityFactory {
  private world: World = null;
  constructor(world: World) {
    this.world = world;
  }

  public createEntity(name: string, components: any[]) {
    const entity = this.world.createEntity(name);
    for (const component of components) {
      entity.addComponent(component);
    }
    return entity;
  }

  public createPlayerEntity(name: string, color: string, pos: Vec2) {
    const e = this.createEntity(name, [CPlayer, CPosition]);
    e.getMutableComponent(CPlayer).color = color;
    e.getMutableComponent(CPosition).x = pos.x;
    e.getMutableComponent(CPosition).y = pos.x;
  }
}
