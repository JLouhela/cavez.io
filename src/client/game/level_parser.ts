import * as PIXI from 'pixi.js';
import { LevelSource } from '../../shared/game/level/level_source.js';
import { Pixel } from '../../shared/game/level/level_source.js';

export class LevelParser {
  private renderer: PIXI.Renderer = null;
  constructor(renderer: PIXI.Renderer) {
    this.renderer = renderer;
  }

  public readPng = (sprite: PIXI.Sprite) => {
    const extract = this.renderer.plugins.extract as PIXI.Extract
    const pixels = extract.pixels(sprite);
    const source: LevelSource = { width: 0, height: 0, pixelData: [] };
    source.width = sprite.width;
    source.height = sprite.height;
    for (let y = 0; y < sprite.height; y++) {
      for (let x = 0; x < sprite.width; x++) {
        const idx = (sprite.width * y + x) << 2;
        source.pixelData.push(
          new Pixel(
            pixels[idx],
            pixels[idx + 1],
            pixels[idx + 2],
            pixels[idx + 3]
          )
        );
      }
    }
    const approxKiloBytes = 8 * 4 * source.width * source.height / 1024;
    console.log(`Level image data parsed, approx size ${approxKiloBytes}kb`);
    return source;
  }
}
