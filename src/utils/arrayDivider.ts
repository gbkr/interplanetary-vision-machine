export function arrayDivider<T>(array: T[], n: number): T[][] {
  const result = Array.from({ length: n }, () => []);
  if (typeof array === "undefined" || !array.length) {
    return result;
  }

  let pointer = 0;
  array.forEach((e) => {
    result[pointer].push(e);
    pointer++;
    if (pointer === n) pointer = 0;
  });

  return result;
}
