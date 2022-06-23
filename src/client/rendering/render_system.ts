import * as PIXI from 'pixi.js';
import { System, World, Entity, Attributes } from 'ecsy';
import { SpriteCache } from '../assets/sprite_cache.js';
import { CSprite } from './csprite.js';
import { CPosition } from '../../shared/game/component/cposition.js';
import { IVec2 } from '../../shared/math/vector.js';
import { CPhysics } from '../../shared/game/component/cphysics.js';
import { ParallaxBg } from './parallax_bg.js';
import { Camera } from '../game/camera/camera.js';
import { EnvironmentTexture } from './environment_texture.js';
import { AssetName } from '../assets/asset_names.js';

export class RenderSystem extends System {
  private spriteCache: SpriteCache = null;
  private renderer: PIXI.Renderer = null;
  private container: PIXI.Container = null;
  private parallaxBg: ParallaxBg = null;
  private environment: EnvironmentTexture = null;
  private camera: Camera;
  private prevCameraSize: { w: number, h: number } = { w: 0, h: 0 };

  // TODO pass in level manager for current level
  constructor(world: World<Entity>, attributes?: Attributes) {
    super(world, attributes);

    this.spriteCache = attributes.spriteCache as SpriteCache;
    this.camera = attributes.camera as Camera;
    this.renderer = attributes.renderer as PIXI.Renderer;

    this.container = new PIXI.Container();
    const TODO_PASS_AS_ARG_LEVEL = AssetName.LEVEL_1;
    // TODO: start pos of env is wrong -> clients not in sync
    this.environment = new EnvironmentTexture(
      this.spriteCache.getAssetManager(),
      this.renderer,
      TODO_PASS_AS_ARG_LEVEL
    );

    const cameraBounds = this.camera.getBounds();

    this.parallaxBg = new ParallaxBg(
      this.spriteCache.getAssetManager(),
      cameraBounds.w,
      cameraBounds.h
    );
    this.prevCameraSize = { w: cameraBounds.w, h: cameraBounds.h };
  }

  private checkCameraSize() {
    // TODO use an event instead of polling, this is fast solution to get things rolling
    const bounds = this.camera.getBounds();
    if (this.prevCameraSize.w !== bounds.w || this.prevCameraSize.h !== bounds.h) {
      this.onCameraResize();
    }
    this.prevCameraSize.w = bounds.w;
    this.prevCameraSize.h = bounds.h;
  }

  execute(_delta: number, _time: number) {
    // TODO optimize: re-add on each frame is costly
    // Could use access by name
    this.checkCameraSize();
    this.container.removeChildren();

    const cameraDelta: IVec2 = this.camera.getMovementDelta();
    this.container.addChild(this.parallaxBg.render(cameraDelta));
    this.container.addChild(
      this.environment.render(
        this.camera.getBounds().x,
        this.camera.getBounds().y
      )
    );

    this.queries.renderable.results.forEach((entity) => {
      const spriteComp = entity.getComponent(CSprite);
      const posComp = entity.getComponent(CPosition);
      const physicsComp = entity.getComponent(CPhysics);

      const sprite: PIXI.Sprite = this.spriteCache.getSprite(
        spriteComp.spriteId
      );

      if (physicsComp) {
        sprite.rotation = physicsComp.angle;
      }

      sprite.position.y = posComp.y;
      sprite.position.x = posComp.x;

      const screenPos = this.camera.getScreenPos({
        x: posComp.x,
        y: posComp.y,
        w: sprite.width,
        h: sprite.height,
      });
      if (screenPos.visible) {
        sprite.tint = spriteComp.hue;
        sprite.x = screenPos.x;
        sprite.y = screenPos.y;
        sprite.visible = true;
        this.container.addChild(sprite);
      } else {
        sprite.visible = false;
      }
    });
    // Render all
    this.renderer.render(this.container);
  }

  onCameraResize(): void {
    this.parallaxBg = new ParallaxBg(
      this.spriteCache.getAssetManager(),
      this.camera.getBounds().w,
      this.camera.getBounds().h
    );
  }

}


RenderSystem.queries = {
  renderable: {
    components: [CSprite, CPosition],
  },
};
