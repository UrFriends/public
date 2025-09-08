//takes date property from lastConvo objects and returns a simplified date string
export function getDateFromDateTime(dateTimeString: string) {

  // Create a Date object from the string
  const date = new Date(dateTimeString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate() + 1;

  if (`${month}/${day}/${year}` == "NaN/NaN/NaN") {
    return "";
  }

  return `${month}/${day}/${year}`;
}

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
