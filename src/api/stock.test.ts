import { describe, expect, it } from 'vitest';
import { mapStockPhoto, normalizeStockSearchResponse } from './stock';

describe('backend stock mapping', () => {
  it('maps generic stock items into photo cards', () => {
    const mapped = normalizeStockSearchResponse(
      {
        items: [{ id: 11, type: 'photo', preview_url: 'https://cdn.example/a.jpg', width: 800, height: 600, photographer: 'Ada' }],
        total_results: 1,
        next_page: '2',
      },
      'images'
    );
    expect(mapped.photos[0].src.large).toBe('https://cdn.example/a.jpg');
    expect(mapped.photos[0].photographer).toBe('Ada');
    expect(mapped.next).toBe('2');
  });

  it('keeps pexels-shaped photo objects', () => {
    const photo = mapStockPhoto({
      id: 9,
      width: 100,
      height: 80,
      photographer: 'Lin',
      src: { large: 'https://cdn.example/large.jpg', medium: 'https://cdn.example/medium.jpg' },
    });
    expect(photo.src.large).toBe('https://cdn.example/large.jpg');
    expect(photo.src.medium).toBe('https://cdn.example/medium.jpg');
  });
});
