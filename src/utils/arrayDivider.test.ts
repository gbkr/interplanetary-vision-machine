import { arrayDivider } from "./arrayDivider";

test("returns an array of n arrays if input array undefined", () => {
  const result = arrayDivider(undefined, 2);
  expect(result).toStrictEqual([[], []]);
});

test("returns an array of n arrays if input array is empty", () => {
  const result = arrayDivider([], 2);
  expect(result).toStrictEqual([[], []]);
});

test("returns a 2D array with n sub-arrays", () => {
  const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const result = arrayDivider(inputArray, 4);
  expect(result).toStrictEqual([
    [1, 5, 9],
    [2, 6, 10],
    [3, 7],
    [4, 8],
  ]);
});
