import * as PIXI from 'pixi.js';
import { System } from 'ecsy';
import { SpriteCache } from '../assets/sprite_cache';
import { GameState } from '../game/game_state';
import { CSprite } from '../../shared/game/component/csprite';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CPosition } from '../../shared/game/component/cposition';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
import { IVec2 } from '../../shared/math/vector';

export class RenderSystem extends System {
  private canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  private spriteCache: SpriteCache = null;
  private gameState: GameState = null;
  private renderer: PIXI.Renderer = null;
  private container: PIXI.Container = null;

  // Options for rendering client server positions as received
  private ghostSpriteId: number = -1;
  private renderGhost: boolean = true; // TODO generate somehow from webpack cfg?

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
    this.gameState = attributes.gameState;
    this.renderer = new PIXI.Renderer({ view: this.canvas });
    this.container = new PIXI.Container();
  }

  execute(delta: number, time: number) {
    // TODO: check if dirty removal provides benefits
    // Depends on performance of remove => re-add all sprites
    this.container.removeChildren();
    this.queries.renderable.results.forEach((entity) => {
      const spriteComp = entity.getComponent(CSprite);
      const posComp = entity.getComponent(CPosition);

      const sprite: PIXI.Sprite = this.spriteCache.getSprite(
        spriteComp.spriteId
      );

      sprite.position.x = posComp.x;
      sprite.position.y = posComp.y;
      this.container.addChild(sprite);
    });

    // Render unmodified server positions for client player
    this.handleGhostRender();
    // Render all
    this.renderer.render(this.container);
  }

  private handleGhostRender(): void {
    if (this.renderGhost) {
      const clientPlayerEntity = this.queries.ghost.results.find((entity) => {
        return entity.id === this.gameState.getPlayerId();
      });

      if (clientPlayerEntity) {
        if (this.ghostSpriteId < 0) {
          this.initPlayerGhost(
            clientPlayerEntity.getComponent(CSprite).spriteId
          );
        }
        this.renderPlayerGhost(
          this.gameState.getLatest().entityUpdates[clientPlayerEntity.id].pos
        );
      }
    }
  }

  private renderPlayerGhost(networkPos: IVec2): void {
    const ghostSprite = this.spriteCache.getSprite(this.ghostSpriteId);
    ghostSprite.x = networkPos.x;
    ghostSprite.y = networkPos.y;
    this.container.addChild(ghostSprite);
  }

  private initPlayerGhost(playerSpriteId: number): void {
    const playerSprite = this.spriteCache.getSprite(playerSpriteId);
    this.ghostSpriteId = this.spriteCache.createSpriteFromTexture(
      playerSprite.texture
    );
    const ghostSprite = this.spriteCache.getSprite(this.ghostSpriteId);
    ghostSprite.alpha = 0.5;
  }
}

RenderSystem.queries = {
  renderable: {
    components: [CSprite, CPosition],
  },
  ghost: {
    components: [CPlayer, CSprite],
  },
};
