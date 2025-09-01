//shortens conversation and adds "..." if it is longer than a character count
export const shortenConversation = (topic: string, count: number) => {
  if (topic.length > count) {
    return topic.slice(0, count) + "...";
  }
  return topic;
};
