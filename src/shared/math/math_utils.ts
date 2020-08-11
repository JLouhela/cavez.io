// lower_bound zero as no other functionality likely needed
export function wrap(num: number, upperBound: number) {
  if (num < 0) {
    num += upperBound;
  } else if (num >= upperBound) {
    num -= upperBound;
  }
  return num;
}
