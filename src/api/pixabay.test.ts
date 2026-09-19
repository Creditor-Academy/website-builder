import { describe, expect, it } from 'vitest';
import { buildPixabaySearchParams } from './pixabay';

describe('Pixabay search filters', () => {
  it('sends image type, orientation, category, color, and order', () => {
    const params = buildPixabaySearchParams('office', {
      page: 2,
      perPage: 20,
      imageType: 'photo',
      orientation: 'horizontal',
      category: 'nature',
      colors: 'blue',
      order: 'latest',
    });
    expect(params.get('q')).toBe('office');
    expect(params.get('page')).toBe('2');
    expect(params.get('image_type')).toBe('photo');
    expect(params.get('orientation')).toBe('horizontal');
    expect(params.get('category')).toBe('nature');
    expect(params.get('colors')).toBe('blue');
    expect(params.get('order')).toBe('latest');
    expect(params.get('safesearch')).toBe('true');
  });

  it('omits empty optional filters', () => {
    const params = buildPixabaySearchParams('food', {
      imageType: 'all',
      orientation: 'all',
      category: '',
      colors: '',
      order: '',
    });
    expect(params.has('image_type')).toBe(false);
    expect(params.has('orientation')).toBe(false);
    expect(params.has('category')).toBe(false);
    expect(params.has('colors')).toBe(false);
    expect(params.has('order')).toBe(false);
  });
});
