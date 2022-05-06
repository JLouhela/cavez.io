import * as PIXI from 'pixi.js'
import { AssetName } from './asset_names.js';
import ship_basic_white from '../../../public/assets/ship_basic_white.png';
import Parallax60 from '../../../public/assets/Parallax60.png';
import Parallax80 from '../../../public/assets/Parallax80.png';
import Parallax100 from '../../../public/assets/Parallax100.png';
import Level1 from '../../../public/assets/level_1.png';

export class AssetManager {
  private ASSET_URIS: { [assetName: string]: string } = {};
  private textures: { [textureName: string]: PIXI.Texture } = {};

  private loader = PIXI.Loader.shared; // Premade shared instance

  // TODO support sprite sheet instead
  constructor() {
    this.ASSET_URIS[AssetName.PLAYER_BASIC_SHIP] = ship_basic_white as string;
    this.ASSET_URIS[AssetName.PARALLAX_1] = Parallax100 as string;
    this.ASSET_URIS[AssetName.PARALLAX_2] = Parallax80 as string;
    this.ASSET_URIS[AssetName.PARALLAX_3] = Parallax60 as string;
    this.ASSET_URIS[AssetName.LEVEL_1] = Level1 as string;
  }

  loadAssets() {
    const loadedPromise = new Promise<void>((resolve) => {
      for (const [assetId, assetUri] of Object.entries(this.ASSET_URIS)) {
        console.log('Loading asset ' + assetId + ' : ' + assetUri);
        this.loader.add(assetId, assetUri);
      }

      for (const name of Object.keys(this.ASSET_URIS)) {
        this.loader.load((loader, resources) => {
          this.textures[resources[name].name] = resources[name].texture;
          console.log(resources[name].name + ' loaded');
        });
      }

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
