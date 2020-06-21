import * as PIXI from 'pixi.js';
import { System } from 'ecsy';
import { SpriteCache } from '../assets/sprite_cache';
import { GameState } from '../game/game_state';
import { CSprite } from '../../shared/game/component/csprite';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CPosition } from '../../shared/game/component/cposition';
import { CNetworkSync } from '../../shared/game/component/cnetwork_sync';
import { IVec2 } from '../../shared/math/vector';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { CPhysics } from '../../shared/game/component/cphysics';
import { ParallaxBg } from './parallax_bg';
import { Camera } from '../game/camera';

export class RenderSystem extends System {
  private canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  private spriteCache: SpriteCache = null;
  private gameState: GameState = null;
  private renderer: PIXI.Renderer = null;
  private container: PIXI.Container = null;
  private parallaxBg: ParallaxBg = null;
  private camera: Camera;

  // Options for rendering client server positions as received
  private ghostSpriteId: number = -1;
  private renderGhost: boolean = true; // TODO generate somehow from webpack cfg?

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);

    // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
    // 800 in-game units of width. TODO: camera needs to be scaled too
    // const scaleRatio = Math.max(1, 800 / window.innerWidth);
    // this.canvas.width = scaleRatio * window.innerWidth;
    // this.canvas.height = scaleRatio * window.innerHeight;

    this.spriteCache = attributes.spriteCache;
    this.gameState = attributes.gameState;
    this.camera = attributes.camera;
    this.renderer = new PIXI.Renderer({ view: this.canvas });
    // TODO why / 2? Screen area seems to be half of the render size :|
    this.camera.setSize({
      x: this.renderer.width / 2,
      y: this.renderer.height / 2,
    });
    this.container = new PIXI.Container();
    this.parallaxBg = new ParallaxBg(
      this.spriteCache.getAssetManager(),
      this.canvas.width,
      this.canvas.height
    );
  }

  execute(delta: number, time: number) {
    // TODO optimize: re-add on each frame is costly
    // Could use access by name
    this.container.removeChildren();

    const cameraPos: IVec2 = this.camera.getMovementDelta();
    this.container.addChild(this.parallaxBg.render(cameraPos));

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

    // Render unmodified server positions for client player
    this.handleGhostRender();
    // Render all
    this.renderer.render(this.container);
  }

  private handleGhostRender(): void {
    if (!this.renderGhost) {
      return;
    }
    const clientPlayerEntity = this.queries.ghost.results.find((entity) => {
      return entity.id === this.gameState.getPlayerId();
    });

    if (clientPlayerEntity) {
      if (this.ghostSpriteId < 0) {
        this.initPlayerGhost(clientPlayerEntity.getComponent(CSprite).spriteId);
      }
      const serverId = clientPlayerEntity.getComponent(CNetworkEntity).serverId;
      this.renderPlayerGhost(
        this.gameState.getLatest().entityUpdates[serverId].pos,
        this.gameState.getLatest().entityUpdates[serverId].physics.angle
      );
    }
  }

  private renderPlayerGhost(networkPos: IVec2, angle: number): void {
    const ghostSprite = this.spriteCache.getSprite(this.ghostSpriteId);
    const screenPos = this.camera.getScreenPos({
      x: networkPos.x,
      y: networkPos.y,
      w: ghostSprite.width,
      h: ghostSprite.height,
    });

    ghostSprite.x = screenPos.x;
    ghostSprite.y = screenPos.y;
    ghostSprite.rotation = angle;
    this.container.addChild(ghostSprite);
  }

  private initPlayerGhost(playerSpriteId: number): void {
    const playerSprite = this.spriteCache.getSprite(playerSpriteId);
    this.ghostSpriteId = this.spriteCache.createSpriteFromTexture(
      playerSprite.texture
    );
    const ghostSprite = this.spriteCache.getSprite(this.ghostSpriteId);
    ghostSprite.alpha = 0.2;
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
