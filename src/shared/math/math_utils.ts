// lower_bound zero as no other functionality likely needed
export function wrap(num: number, upper_bound: number) {
  if (num < 0) {
    num += upper_bound;
  } else if (num >= upper_bound) {
    num -= upper_bound;
  }
  return num;
}
