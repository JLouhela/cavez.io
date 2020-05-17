import { World } from 'ecsy';
import { CPosition } from './../component/cposition';
import { CPlayer } from './../component/cplayer';
import * as Math from './../../math/vector';

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

  public createPlayerEntity(name: string, color: string) {
    let e = this.createEntity(name, [CPlayer, CPosition]);
    e.getMutableComponent(CPlayer).color = color;
  }
}
