import { Entity } from 'ecsy';

export class GameState {
  private entities: { [id: number]: Entity } = {};

  public updateEntity(e: Entity) {
    if (!this.entities[e.id]) {
      this.entities[e.id] = e;
      return;
    }
    // Deep copy?
    this.entities[e.id] = e;
  }

  public getDelta(id: number) {
    // No delta for now, just the entity
    return this.entities[id];
  }
}
