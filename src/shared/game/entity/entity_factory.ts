import { World } from 'ecsy';

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
  }
}
