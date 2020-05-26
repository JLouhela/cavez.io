import * as PIXI from 'pixi.js';
import { AssetName } from './asset_names';
import ship_basic_white from '../../../public/assets/ship_basic_white.png';

export class AssetManager {
  private ASSET_URIS: { [assetName: string]: string } = {};
  private textures: { [textureName: string]: PIXI.Texture } = {};

  private loader = PIXI.Loader.shared; // Premade shared instance

  // TODO support sprite sheet instead
  constructor() {
    this.ASSET_URIS[AssetName.PLAYER_BASIC_SHIP] = ship_basic_white;
  }

  loadAssets() {
    const loadedPromise = new Promise((resolve) => {
      for (const [assetId, assetUri] of Object.entries(this.ASSET_URIS)) {
        console.log('Loading asset ' + assetId + ' : ' + assetUri);
        this.loader.add(assetId, assetUri);
      }
      this.loader.load((loader, resources) => {
        this.textures[resources[AssetName.PLAYER_BASIC_SHIP].name] =
          resources[AssetName.PLAYER_BASIC_SHIP].texture;
        console.log(resources[AssetName.PLAYER_BASIC_SHIP].name + ' loaded');
      });
      this.loader.onComplete.add(() => {
        resolve();
        console.log('Assets loaded');
      });
    });
    return loadedPromise;
  }

  getTexture(name: string): PIXI.Texture {
    return this.textures[name];
  }
}
