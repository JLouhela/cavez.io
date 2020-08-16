import { IVec2 } from './vector';

// lower_bound zero as no other functionality likely needed
export function wrap(num: number, upperBound: number) {
  if (num < 0) {
    num += upperBound;
  } else if (num >= upperBound) {
    num -= upperBound;
  }
  return num;
}

export function rotatePoint(point: IVec2, angle: number): IVec2 {
  return {
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
  };
}
