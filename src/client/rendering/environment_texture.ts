import * as PIXI from 'pixi.js';
import { AssetManager } from '../assets/asset_manager.js';
import { AssetName } from '../assets/asset_names.js';
import * as Constants from '../../shared/constants.js';

export class EnvironmentTexture {
  private container = new PIXI.Container();
  private bg: PIXI.TilingSprite = null;
  private bgTex: PIXI.RenderTexture = null;
  private renderer: PIXI.Renderer = null;

  // TODO pass in updated chunks for masking stuff out
  constructor(
    assetManager: AssetManager,
    renderer: PIXI.Renderer,
    level: AssetName
  ) {
    this.renderer = renderer;
    // RenderTexture allows masking modifications (destroyed world)
    this.bgTex = PIXI.RenderTexture.create({
      width: Constants.WORLD_BOUNDS.x,
      height: Constants.WORLD_BOUNDS.y,
    });

    // No need to cache bg sprite, just render it once
    const bgSprite = new PIXI.Sprite(assetManager.getTexture(level));
    renderer.render(bgSprite, this.bgTex);

    this.bg = new PIXI.TilingSprite(
      this.bgTex,
      Constants.WORLD_BOUNDS.x,
      Constants.WORLD_BOUNDS.y
    );
    this.container.addChild(this.bg);
  }

  public render(x: number, y: number): PIXI.Container {
    const bg = this.container.getChildAt(0) as PIXI.TilingSprite;
    bg.tilePosition.x = -x;
    bg.tilePosition.y = -y;
    return this.container;
  }
}
