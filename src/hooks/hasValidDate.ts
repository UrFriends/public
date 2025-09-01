import { Conversation, ISODateString } from "../../types/Types";

export function hasValidDate(c: Conversation): c is Conversation & { date: ISODateString } {
  console.log(c, "c is c")
  return typeof c.date === "string" && !Number.isNaN(new Date(c.date).getTime());
}
