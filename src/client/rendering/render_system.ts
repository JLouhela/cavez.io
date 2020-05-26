import * as PIXI from 'pixi.js';
import { System } from 'ecsy';
import { SpriteCache } from '../assets/sprite_cache';
import { CSprite } from '../../shared/game/component/csprite';
import { CPosition } from '../../shared/game/component/cposition';

export class RenderSystem extends System {
  private canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  private spriteCache: SpriteCache = null;
  private renderer: PIXI.Renderer = null;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);
    // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
    // 800 in-game units of width.
    const scaleRatio = Math.max(1, 800 / window.innerWidth);
    this.canvas.width = scaleRatio * window.innerWidth;
    this.canvas.height = scaleRatio * window.innerHeight;
    this.spriteCache = attributes.spriteCache;
    this.renderer = new PIXI.Renderer({ view: this.canvas });
  }

  execute(delta: number, time: number) {
    this.queries.renderable.results.forEach((entity) => {
      const spriteComp = entity.getComponent(CSprite);
      const posComp = entity.getComponent(CPosition);

      const sprite: PIXI.Sprite = this.spriteCache.getSprite(
        spriteComp.spriteId
      );

      sprite.position.x = posComp.x;
      sprite.position.y = posComp.y;
      this.renderer.render(sprite);
    });
  }
}

RenderSystem.queries = {
  renderable: {
    components: [CSprite, CPosition],
  },
};
