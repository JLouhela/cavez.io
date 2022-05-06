import { System, World, Entity, Attributes } from 'ecsy';
import { CCameraFollow } from './ccamera_follow.js';
import { Camera } from './camera.js';
import { CPosition } from '../../../shared/game/component/cposition.js';

export class CameraSystem extends System {
  private camera: Camera;
  private cameraSnapDistance = 100;

  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);
    this.camera = attributes.camera as Camera;
  }

  execute(delta: number, _time: number) {
    // Assume there's only single CCameraFollow for now
    this.queries.all.results.forEach((entity) => {
      const pos = entity.getComponent(CPosition);
      if (
        Math.abs(this.camera.getCenter().x - pos.x) > this.cameraSnapDistance ||
        Math.abs(this.camera.getCenter().y - pos.y) > this.cameraSnapDistance
      ) {
        this.camera.snap(pos);
      }
      this.camera.update({ x: pos.x, y: pos.y }, delta);
    });
  }
}

CameraSystem.queries = {
  all: {
    components: [CCameraFollow, CPosition],
  },
};
