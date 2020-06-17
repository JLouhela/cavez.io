import { Entity } from 'ecsy';
import { IVec2 } from '../../shared/math/vector';
import { IRect } from '../../shared/math/rect';
import { Rect } from '../../shared/math/rect';

export interface IScreenPos {
  readonly x: number;
  readonly y: number;
  readonly visible: boolean;
}

export class Camera {
  bounds: Rect = new Rect(0, 0, 0, 0);
  centerPos: IVec2 = { x: 0, y: 0 };
  levelSize: IVec2 = { x: 0, y: 0 };

  public setSize(size: IVec2) {
    this.bounds.w = size.x;
    this.bounds.h = size.y;
  }

  public setLevelSize(size: IVec2) {
    this.levelSize = size;
  }

  public update(centerPos: IVec2, delta: number): void {
    const newX = this.centerPos.x - (this.centerPos.x - centerPos.x) * delta;
    const newY = this.centerPos.y - (this.centerPos.y - centerPos.y) * delta;
    this.centerPos = { x: newX, y: newY };

    this.bounds.x = this.centerPos.x - this.bounds.w / 2;
    this.bounds.y = this.centerPos.y - this.bounds.h / 2;
  }

  public getBounds(): IRect {
    return this.bounds;
  }

  public getCenter(): IVec2 {
    return this.centerPos;
  }

  public getScreenPos(rect: IRect): IScreenPos {
    if (rect.x < this.bounds.x) {
      rect.x += this.levelSize.x;
    }
    if (rect.y < this.bounds.y) {
      rect.y += this.levelSize.y;
    }

    const ret = { x: 0, y: 0, visible: false };
    ret.visible = this.bounds.overlaps(rect);
    ret.x = rect.x - this.bounds.x / 2;
    ret.y = rect.y - this.bounds.y / 2;
    return ret;
  }

  public transform(pos: IVec2): IVec2 {
    return { x: pos.x - this.bounds.x, y: pos.y - this.bounds.y };
  }
}
