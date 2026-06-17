type SearchableItem = {
  title?: string;
  description?: string;
  course?: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  date?: string;
};

export function searchAndSortItems<T extends SearchableItem>(
  items: T[],
  searchText: string
) {
  const query = searchText.trim().toLowerCase();

  if (!query) {
    return items;
  }

  return items
    .map((item) => {
      const title = item.title?.toLowerCase() || "";
      const course = item.course?.toLowerCase() || "";
      const subject = item.subject?.toLowerCase() || "";
      const chapter = item.chapter?.toLowerCase() || "";
      const topic = item.topic?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      const date = item.date?.toLowerCase() || "";

      let score = 0;

      if (title.includes(query)) score += 100;
      if (course.includes(query)) score += 80;
      if (subject.includes(query)) score += 60;
      if (chapter.includes(query)) score += 50;
      if (topic.includes(query)) score += 50;
      if (description.includes(query)) score += 30;
      if (date.includes(query)) score += 20;

      return {
        item,
        score,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);
}