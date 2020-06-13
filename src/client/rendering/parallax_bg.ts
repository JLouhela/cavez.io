import * as PIXI from 'pixi.js';
import { IVec2 } from '../../shared/math/vector';
import { AssetManager } from '../assets/asset_manager';
import { AssetName } from '../assets/asset_names';

export class ParallaxBg {
  private container = new PIXI.Container();
  private screenWidth: number = 0;
  private screenHeight: number = 0;
  private screenWidthHalf: number = 0;
  private screenHeightHalf: number = 0;

  // Not sure if it's needed to keep the reference alive
  // For an odd reason modifications of sprites inside container
  // does not work if member references are not stored
  private parallaxFar: PIXI.TilingSprite = null;
  private parallaxMid: PIXI.TilingSprite = null;
  private parallaxNear: PIXI.TilingSprite = null;

  private farSpeed: number = 0.1;
  private midSpeed: number = 0.4;
  private nearSpeed: number = 1.0;

  constructor(
    assetManager: AssetManager,
    screenWidth: number,
    screenHeight: number
  ) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.screenWidthHalf = screenWidth / 2;
    this.screenHeightHalf = screenHeight / 2;
    // TODO optimize: 2 x size can be multiplied by speed
    this.parallaxFar = new PIXI.TilingSprite(
      assetManager.getTexture(AssetName.PARALLAX_1),
      2 * screenWidth,
      2 * screenHeight
    );
    this.parallaxMid = new PIXI.TilingSprite(
      assetManager.getTexture(AssetName.PARALLAX_2),
      2 * screenWidth,
      2 * screenHeight
    );
    this.parallaxNear = new PIXI.TilingSprite(
      assetManager.getTexture(AssetName.PARALLAX_3),
      2 * screenWidth,
      2 * screenHeight
    );
    this.container.addChild(this.parallaxFar);
    this.container.addChild(this.parallaxMid);
    this.container.addChild(this.parallaxNear);
  }

  public render(cameraPos: IVec2): PIXI.Container {
    const parallaxFar = this.container.getChildAt(0) as PIXI.TilingSprite;
    parallaxFar.tilePosition.x =
      (this.farSpeed * cameraPos.x + this.screenWidthHalf) % this.screenWidth;
    parallaxFar.tilePosition.y =
      (this.farSpeed * cameraPos.y + this.screenHeightHalf) % this.screenHeight;

    const parallaxMid = this.container.getChildAt(1) as PIXI.TilingSprite;
    parallaxMid.tilePosition.x =
      (this.midSpeed * cameraPos.x + this.screenWidthHalf) % this.screenWidth;
    parallaxMid.tilePosition.y =
      (this.midSpeed * cameraPos.y + this.screenHeightHalf) % this.screenHeight;

    const parallaxNear = this.container.getChildAt(2) as PIXI.TilingSprite;
    parallaxNear.tilePosition.x =
      (this.nearSpeed * cameraPos.x + this.screenWidthHalf) % this.screenWidth;
    parallaxNear.tilePosition.y =
      (this.nearSpeed * cameraPos.y + this.screenHeightHalf) %
      this.screenHeight;

    return this.container;
  }
}
