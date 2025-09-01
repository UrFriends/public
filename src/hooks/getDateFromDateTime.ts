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
