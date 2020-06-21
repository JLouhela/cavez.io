import { Entity } from 'ecsy';
import { IVec2 } from '../../shared/math/vector';
import { IRect } from '../../shared/math/rect';
import { Rect } from '../../shared/math/rect';

export interface IScreenPos {
  readonly x: number;
  readonly y: number;
  readonly visible: boolean;
}

// TODO missing scale, bounds are wrong
export class Camera {
  private bounds: Rect = new Rect(0, 0, 0, 0);
  private centerPos: IVec2 = { x: 0, y: 0 };
  private levelSize: IVec2 = { x: 0, y: 0 };
  private targetCenterPos: IVec2 = { x: 0, y: 0 };
  private movementDelta: IVec2 = { x: 0, y: 0 };
  private lerpSpeed: number = 1;

  public setSize(size: IVec2) {
    this.bounds.w = size.x;
    this.bounds.h = size.y;
  }

  public setLevelSize(size: IVec2) {
    this.levelSize = size;
  }

  public update(centerPos: IVec2, delta: number): void {
    const deltaX = (centerPos.x - this.centerPos.x) * delta * this.lerpSpeed;
    const deltaY = (centerPos.y - this.centerPos.y) * delta * this.lerpSpeed;
    this.centerPos = {
      x: this.centerPos.x + deltaX,
      y: this.centerPos.y + deltaY,
    };
    this.movementDelta = { x: deltaX, y: deltaY };
    this.targetCenterPos = centerPos;
    this.updateBounds();
  }

  public snap(centerPos: IVec2) {
    const delta = {
      x: this.targetCenterPos.x - this.centerPos.x,
      y: this.targetCenterPos.y - this.centerPos.y,
    };
    this.centerPos = { x: centerPos.x - delta.x, y: centerPos.y - delta.y };
    this.updateBounds();
  }

  private updateBounds() {
    this.bounds.x = this.centerPos.x - this.bounds.w / 2;
    this.bounds.y = this.centerPos.y - this.bounds.h / 2;
  }

  public getMovementDelta(): IVec2 {
    return this.movementDelta;
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
    ret.x = rect.x - this.bounds.x + this.bounds.w / 2;
    ret.y = rect.y - this.bounds.y + this.bounds.h / 2;
    return ret;
  }

  public transform(pos: IVec2): IVec2 {
    return { x: pos.x - this.bounds.x, y: pos.y - this.bounds.y };
  }
}
