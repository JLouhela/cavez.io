import * as PIXI from 'pixi.js';
import ship_basic_white from '../../public/assets/ship_basic_white.png';

export class AssetManager {
  private ASSET_URIS: { [assetName: string]: string } = {};
  private sprites: { [spriteName: string]: object } = {};

  private loader = PIXI.Loader.shared; // Premade shared instance

  constructor() {
    this.ASSET_URIS.basic_ship = ship_basic_white;
  }

  loadAssets() {
    const loadedPromise = new Promise((resolve) => {
      for (const [assetId, assetUri] of Object.entries(this.ASSET_URIS)) {
        console.log('Loading asset ' + assetId + ' : ' + assetUri);
        this.loader.add(assetId, assetUri);
      }
      this.loader.load((loader, resources) => {
        this.sprites[resources.basic_ship.name] = new PIXI.Sprite(
          resources.basic_ship.texture
        );
        console.log(resources.basic_ship.name + ' loaded');
      });
      this.loader.onComplete.add(() => {
        resolve();
        console.log('Assets loaded');
      });
    });
    return loadedPromise;
  }

  getSprite(spritename: string) {
    return this.sprites[spritename];
  }
}
