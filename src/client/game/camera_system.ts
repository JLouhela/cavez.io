import { System } from 'ecsy';
import { CCameraFollow } from '../../shared/game/component/ccamera_follow';
import { Camera } from './camera';
import { CPosition } from '../../shared/game/component/cposition';

export class CameraSystem extends System {
  private camera: Camera;
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
      this.camera.update({ x: pos.x, y: pos.y }, delta);
    });
  }
}

CameraSystem.queries = {
  all: {
    components: [CCameraFollow, CPosition],
  },
};
