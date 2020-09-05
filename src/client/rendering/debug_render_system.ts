import * as PIXI from 'pixi.js';
import { System } from 'ecsy';
import { SpriteCache } from '../assets/sprite_cache';
import { GameState } from '../game/game_state';
import { CSprite } from './csprite';
import { CPlayer } from '../../shared/game/component/cplayer';
import { CPosition } from '../../shared/game/component/cposition';
import { IVec2 } from '../../shared/math/vector';
import { CNetworkEntity } from '../../shared/game/component/cnetwork_entity';
import { Camera } from '../game/camera/camera';
import { CTerrainCollider } from '../../shared/game/component/cterrain_collider';
import { CPhysics } from '../../shared/game/component/cphysics';
import * as MathUtils from '../../shared/math/math_utils';

export class DebugRenderSystem extends System {
  private spriteCache: SpriteCache = null;
  private gameState: GameState = null;
  private renderer: PIXI.Renderer = null;
  private container: PIXI.Container = null;
  private camera: Camera;

  // Options for rendering client server positions as received
  private ghostSpriteId: number = -1;
  // TODO generate somehow from webpack cfg?
  private renderGhost: boolean = true;
  private renderTerrainCollider: boolean = true;

  constructor(world: any, attributes: any) {
    // Missing from ts ctor -> ts-ignore
    // @ts-ignore
    super(world, attributes);

    this.spriteCache = attributes.spriteCache;
    this.gameState = attributes.gameState;
    this.camera = attributes.camera;
    this.renderer = attributes.renderer;

    this.container = new PIXI.Container();
  }

  execute(delta: number, time: number) {
    this.container.removeChildren();
    // Render unmodified server positions for client player
    this.handleGhostRender();
    this.handleTerrainColliderRender();
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
        this.gameState.getLatestSyncEvent().entityUpdates[serverId].pos,
        this.gameState.getLatestSyncEvent().entityUpdates[serverId].physics
          .angle
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

  private handleTerrainColliderRender(): void {
    if (!this.renderTerrainCollider) {
      return;
    }
    this.queries.terrainColliders.results.forEach((entity) => {
      const terrainCollider = entity.getComponent(CTerrainCollider);
      const posComp = entity.getComponent(CPosition);
      const physComp = entity.getComponent(CPhysics);
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xffff00);
      graphics.lineStyle(5, 0xff0000);
      const radius = 0.5;
      terrainCollider.collisionPoints.forEach((point) => {
        const rotatedPoint = MathUtils.rotatePoint(point, physComp.angle);
        const screenPos = this.camera.getScreenPos({
          x: posComp.x + rotatedPoint.x,
          y: posComp.y + rotatedPoint.y,
          w: radius,
          h: radius,
        });
        if (screenPos.visible) {
          graphics.drawCircle(screenPos.x, screenPos.y, radius);
        }
      });
      this.container.addChild(graphics);
    });
  }
}

DebugRenderSystem.queries = {
  ghost: {
    components: [CPlayer, CSprite],
  },
  terrainColliders: {
    components: [CPlayer, CTerrainCollider, CPosition],
  },
};
