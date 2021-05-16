function monthName(monthNumber: number) {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][monthNumber];
}

export function formatDate(day: Date): string {
  return `${day.getDate()} ${monthName(day.getMonth())} ${day.getFullYear()}`;
}

// Only ever needs to handle endDate being 1 day ahead of startDate
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.toDateString() === endDate.toDateString()) {
    return formatDate(startDate);
  }

  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDate.getDate()} - ${endDate.getDate()} ${monthName(
      startDate.getMonth()
    )} ${startDate.getFullYear()}`;
  } else if (
    startDate.getMonth() !== endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    return `${startDate.getDate()} ${monthName(
      startDate.getMonth()
    )} - ${endDate.getDate()} ${monthName(
      endDate.getMonth()
    )} ${startDate.getFullYear()}`;
  } else if (
    startDate.getMonth() !== endDate.getMonth() &&
    startDate.getFullYear() !== endDate.getFullYear()
  ) {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }
}
