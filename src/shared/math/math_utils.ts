// lower_bound zero as no other functionality likely needed
export function wrap(num: number, upper_bound: number) {
  let n = Math.floor(num);
  if (n < 0) {
    n += upper_bound;
  } else if (n >= upper_bound) {
    n -= upper_bound;
  }
  return n;
}
