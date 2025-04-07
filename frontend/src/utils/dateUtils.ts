export function formatDateTimeString(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  const now = new Date();

  // Strip time and compare just the date (ignoring time)
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const startOfMessageDay = new Date(date.setHours(0, 0, 0, 0));

  const isSameDay = startOfMessageDay.getTime() === startOfToday.getTime();

  if (isSameDay) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  const diffInTime = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

  if (diffInDays === 1) {
    return "Yesterday"; // If it's exactly one day ago
  }

  if (diffInDays < 7) {
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

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
