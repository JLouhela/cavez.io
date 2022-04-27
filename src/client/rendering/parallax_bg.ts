import * as PIXI from 'pixi.js';
import { IVec2 } from '../../shared/math/vector.js';
import { AssetManager } from '../assets/asset_manager.js';
import { AssetName } from '../assets/asset_names.js';

export class ParallaxBg {
  private container = new PIXI.Container();

  // Not sure if it's needed to keep the reference alive
  // For an odd reason modifications of sprites inside container
  // does not work if member references are not stored
  private parallaxFar: PIXI.TilingSprite = null;
  private parallaxMid: PIXI.TilingSprite = null;
  private parallaxNear: PIXI.TilingSprite = null;

  private farSpeed: number = -0.1;
  private midSpeed: number = -0.2;
  private nearSpeed: number = -0.3;

  constructor(
    assetManager: AssetManager,
    screenWidth: number,
    screenHeight: number
  ) {
    this.parallaxFar = new PIXI.TilingSprite(
      assetManager.getTexture(AssetName.PARALLAX_1),
      screenWidth,
      screenHeight
    );
    this.parallaxMid = new PIXI.TilingSprite(
      assetManager.getTexture(AssetName.PARALLAX_2),
      screenWidth,
      screenHeight
    );
    this.parallaxNear = new PIXI.TilingSprite(
      assetManager.getTexture(AssetName.PARALLAX_3),
      screenWidth,
      screenHeight
    );
    this.container.addChild(this.parallaxFar);
    this.container.addChild(this.parallaxMid);
    this.container.addChild(this.parallaxNear);
  }

  public render(cameraDelta: IVec2): PIXI.Container {
    const parallaxFar = this.container.getChildAt(0) as PIXI.TilingSprite;
    parallaxFar.tilePosition.x += this.farSpeed * cameraDelta.x;
    parallaxFar.tilePosition.y += this.farSpeed * cameraDelta.y;

    const parallaxMid = this.container.getChildAt(1) as PIXI.TilingSprite;
    parallaxMid.tilePosition.x += this.midSpeed * cameraDelta.x;
    parallaxMid.tilePosition.y += this.midSpeed * cameraDelta.y;

    const parallaxNear = this.container.getChildAt(2) as PIXI.TilingSprite;
    parallaxNear.tilePosition.x += this.nearSpeed * cameraDelta.x;
    parallaxNear.tilePosition.y += this.nearSpeed * cameraDelta.y;
    return this.container;
  }
}
