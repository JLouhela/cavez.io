import * as PIXI from 'pixi.js';
import { System } from 'ecsy';
import { SpriteCache } from '../assets/sprite_cache';
import { CSprite } from './csprite';
import { CPosition } from '../../shared/game/component/cposition';
import { IVec2 } from '../../shared/math/vector';
import { CPhysics } from '../../shared/game/component/cphysics';
import { ParallaxBg } from './parallax_bg';
import { Camera } from '../game/camera/camera';
import { EnvironmentTexture } from './environment_texture';
import { AssetName } from '../assets/asset_names';

export class RenderSystem extends System {
  private spriteCache: SpriteCache = null;
  private renderer: PIXI.Renderer = null;
  private container: PIXI.Container = null;
  private parallaxBg: ParallaxBg = null;
  private environment: EnvironmentTexture = null;
  private camera: Camera;

  // TODO pass in level manager for current level
  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);

    this.spriteCache = attributes.spriteCache;
    this.camera = attributes.camera;
    this.renderer = attributes.renderer;

    this.container = new PIXI.Container();
    const TODO_PASS_AS_ARG_LEVEL = AssetName.LEVEL_1;
    // TODO: start pos of env is wrong -> clients not in sync
    this.environment = new EnvironmentTexture(
      this.spriteCache.getAssetManager(),
      this.renderer,
      TODO_PASS_AS_ARG_LEVEL
    );

    this.parallaxBg = new ParallaxBg(
      this.spriteCache.getAssetManager(),
      this.camera.getBounds().w,
      this.camera.getBounds().h
    );
  }

  execute(delta: number, time: number) {
    // TODO optimize: re-add on each frame is costly
    // Could use access by name
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
}

RenderSystem.queries = {
  renderable: {
    components: [CSprite, CPosition],
  },
};
