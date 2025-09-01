import { Conversation } from "../../types/Types";

export function getMostRecentConversation(
  convos: Conversation[]
): Conversation {

  if (!convos || (Array.isArray(convos) && convos.length === 0)) return { date: "", topic: "" };

  if (convos && (Array.isArray(convos))) {
    const mostRecent = convos.reduce((a, b) =>
      new Date(b.date ?? "").getTime() > new Date(a.date ?? "").getTime() ? b : a
    );
      return {
        date: mostRecent.date ?? "",
        topic: mostRecent.topic ?? "",
      };
  } else {
  return {
    date: "",
    topic: "",
  }
  }
}
