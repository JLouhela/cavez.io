import { System } from 'ecsy';
import { CCameraFollow } from './ccamera_follow';
import { Camera } from './camera';
import { CPosition } from '../../../shared/game/component/cposition';
import { TilingSprite } from 'pixi.js';

export class CameraSystem extends System {
  private camera: Camera;
  private cameraSnapDistance: number = 100;
  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    this.camera = attributes.camera;
  }

  execute(delta: number, time: number) {
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
