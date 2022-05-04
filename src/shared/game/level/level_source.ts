export class Pixel {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  // TODO: pack into single number, divides memory consumption by 4
  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

export interface LevelSource {
  pixelData: Pixel[];
  width: number;
  height: number;
}
