import { IVec2 } from './vector';

export interface IRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class Rect {
  public x: number;
  public y: number;
  public w: number;
  public h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  topLeft(): IVec2 {
    return { x: this.x, y: this.y };
  }

  bottomLeft(): IVec2 {
    return { x: this.x, y: this.y + this.h };
  }

  topRight(): IVec2 {
    return { x: this.x + this.w, y: this.y };
  }

  bottomRight(): IVec2 {
    return { x: this.x + this.w, y: this.y + this.h };
  }

  overlaps(other: IRect) {
    if (this.x + this.w < other.x) {
      return false;
    }
    if (this.x > other.x + other.w) {
      return false;
    }
    if (this.y > other.y + other.h) {
      return false;
    }
    if (this.y + this.h < other.y) {
      return false;
    }
    return true;
  }
}
