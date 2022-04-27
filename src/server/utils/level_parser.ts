import { PNG } from 'pngjs';
import * as fs from 'fs';
import { LevelSource } from '../../shared/game/level/level_source.js';
import { Pixel } from '../../shared/game/level/level_source.js';

export function readPng(pngFile: string): Promise<LevelSource> {
  const parsedPromise = new Promise<LevelSource>((resolve) => {
    fs.createReadStream(pngFile)
      .pipe(new PNG({ filterType: 4 }))
      .on('parsed', function () {
        const source: LevelSource = { width: 0, height: 0, pixelData: [] };
        source.width = this.width;
        source.height = this.height;

        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;

            source.pixelData.push(
              new Pixel(
                this.data[idx],
                this.data[idx + 1],
                this.data[idx + 2],
                this.data[idx + 3]
              )
            );
          }
        }
        console.log('Level image data parsed from ' + pngFile);
        resolve(source);
      });
  });
  return parsedPromise;
}
