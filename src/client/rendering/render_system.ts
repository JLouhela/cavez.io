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

    this.spriteCache = attributes.spriteCache;
    this.gameState = attributes.gameState;
    this.camera = attributes.camera;
    this.renderer = attributes.renderer;

    this.container = new PIXI.Container();
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
