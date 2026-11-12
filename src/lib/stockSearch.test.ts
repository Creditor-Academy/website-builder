import { describe, expect, it } from 'vitest';
import { parseStockSearchQuery } from './stockSearch';

describe('parseStockSearchQuery', () => {
  it('uses the video keyword as a media-type override and keeps the remaining query', () => {
    expect(parseStockSearchQuery('nature videos for a hero')).toEqual({
      requestsVideos: true,
      term: 'nature for a hero',
    });
  });

  it('leaves queries without a video keyword unchanged', () => {
    expect(parseStockSearchQuery('nature landscape')).toEqual({
      requestsVideos: false,
      term: 'nature landscape',
    });
  });
});
