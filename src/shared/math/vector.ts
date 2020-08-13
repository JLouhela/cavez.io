import { createType, copyCopyable, cloneClonable } from 'ecsy';

// TODO replace with Point class
export interface IVec2 {
  readonly x: number;
  readonly y: number;
}

export class Vec2 {
  private _x: number = 0;
  private _y: number = 0;
  private _normal: IVec2 = null;

  constructor(x: number, y: number) {
    this.set(x, y);
  }

  private calculateNormal() {
    const len = Math.sqrt(this._x * this._x + this._y * this._y);
    this._normal =
      len === 0 ? { x: 0, y: 0 } : { x: this._x / len, y: this._y / len };
  }

  get normal(): IVec2 {
    if (!this._normal) {
      this.calculateNormal();
    }
    return this._normal;
  }

  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }

  public set(x: number, y: number) {
    this._x = x;
    this._y = y;
    this._normal = null;
  }

  public clone() {
    return new Vec2(this._x, this._y);
  }

  public copy(src: Vec2) {
    this._x = src._x;
    this._y = src._y;
    this._normal = src._normal;
    return this;
  }
}

export const Vec2Type = createType({
  name: 'Vec2',
  default: new Vec2(0, 0),
  copy: copyCopyable,
  clone: cloneClonable,
});
