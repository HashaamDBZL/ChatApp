export function formatDateTimeString(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  const now = new Date();

  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays >= 1) {
    if (diffInDays < 2) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return daysOfWeek[date.getDay()];
    }
  }

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
