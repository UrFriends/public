export function getDateFromDateTime(dateTimeString: string) {
  if (!dateTimeString) return "";

  // Handle "YYYY-MM-DD" safely (your new format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateTimeString)) {
    const [year, month, day] = dateTimeString.split("-").map(Number);
    return `${month}/${day}/${year}`;
  }

  // Fallback for old stored UTC strings
  const date = new Date(dateTimeString);

  if (isNaN(date.getTime())) return "";

  const month = date.getMonth() + 1;
  const day = date.getDate(); // ✅ FIXED (no +1)
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export const parseDate = (d: string | null) => {
  if (!d) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [year, month, day] = d.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const dayChoices = ["1d", "2d", "3d", "4d", "5d", "6d", "1w", "2w", "3w", "1m", "2m", "3m", "4m", "5m", "6m", "u"]

export function interpolateTierTimePeriod(timePeriod: string) {
    switch (timePeriod) {
        case "1d":
            return "1 Day";
        case "2d":
            return "2 Days";
        case "3d":
            return "3 Days";
        case "4d":
            return "4 Days";
        case "5d":
            return "5 Days";
        case "6d":
            return "6 Days";
        case "1w":
            return "1 Week";
        case "2w":
            return "2 Weeks";
        case "3w":
            return "3 Weeks";
        case "1m":
            return "1 Month";
        case "2m":
            return "2 Months";
        case "3m":
            return "3 Months";
        case "4m":
            return "4 Months";
        case "5m":
            return "5 Months";
        case "6m":
            return "6 Months";
        case "u":
            return "No Timeframe"
        default:
            return "Time Frame Error";
    }
}
