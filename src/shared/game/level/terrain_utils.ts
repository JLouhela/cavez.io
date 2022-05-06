import { Pixel } from './level_source.js';

export enum TerrainType {
  None = 0,
  Solid = 1,
  Destructible = 2,
}

export const getTerrainType = (pixel: Pixel) => {
  // TODO design terrain types
  if (pixel.a > 0) {
    return TerrainType.Solid;
  }
  return TerrainType.None;
}
