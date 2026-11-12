export function parseStockSearchQuery(query: string) {
  return {
    requestsVideos: /\bvideos?\b/i.test(query),
    term: query.replace(/\bvideos?\b/gi, ' ').replace(/\s+/g, ' ').trim(),
  };
}
