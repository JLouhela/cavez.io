export interface IVec2 {
  readonly x: number;
  readonly y: number;
}

export class Vec2 {
  readonly x: number;
  readonly y: number;
  readonly normal: IVec2;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const len = Math.sqrt(this.x * this.x + this.y * this.y);
    this.normal =
      len === 0 ? { x: 0, y: 0 } : { x: this.x / len, y: this.y / len };
  }
}
