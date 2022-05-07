export class Pixel {
  public rgba: number;

  constructor(r: number, g: number, b: number, a: number) {
    this.rgba = (r << 24) + (g << 16) + (b << 8) + a;
  }

  public get r(): number {
    return (this.rgba & 0xFF000000) >> 24;
  }

  public get g(): number {
    return (this.rgba & 0xFF0000) >> 16;
  }

  public get b(): number {
    return (this.rgba & 0xFF00) >> 8;
  }

  public get a(): number {
    return this.rgba & 0xFF;
  }

}

export interface LevelSource {
  pixelData: Pixel[];
  width: number;
  height: number;
}
