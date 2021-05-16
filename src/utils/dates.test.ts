import { formatDateRange, formatDate } from "./dates";

test("formatDate()", () => {
  const date = new Date(2020, 11, 6);
  const result = formatDate(date);
  expect(result).toBe("6 Dec 2020");
});

describe("formatDateRange()", () => {
  test("when dates are the same", () => {
    const date = new Date(2020, 11, 6);
    const result = formatDateRange(date, date);
    expect(result).toBe("6 Dec 2020");
  });

  test("when days are different, months the same", () => {
    const startDate = new Date(2020, 11, 6);
    const endDate = new Date(2020, 11, 9);
    const result = formatDateRange(startDate, endDate);
    expect(result).toBe("6 - 9 Dec 2020");
  });

  test("when days are different, months are different", () => {
    const startDate = new Date(2020, 10, 30);
    const endDate = new Date(2020, 11, 1);
    const result = formatDateRange(startDate, endDate);
    expect(result).toBe("30 Nov - 1 Dec 2020");
  });

  test("when days are different, months are different, years are different", () => {
    const startDate = new Date(2020, 11, 31);
    const endDate = new Date(2021, 0, 1);
    const result = formatDateRange(startDate, endDate);
    expect(result).toBe("31 Dec 2020 - 1 Jan 2021");
  });
});
