import { describe, expect, it } from 'vitest';
import { buildPexelsSearchParams } from './pexels';

describe('Pexels search filters', () => {
  it('sends orientation, size, and color so users can narrow media', () => {
    const params = buildPexelsSearchParams('office', {
      page: 2,
      perPage: 12,
      orientation: 'landscape',
      size: 'large',
      color: 'blue',
    });
    expect(params.get('query')).toBe('office');
    expect(params.get('page')).toBe('2');
    expect(params.get('orientation')).toBe('landscape');
    expect(params.get('size')).toBe('large');
    expect(params.get('color')).toBe('blue');
  });

  it('omits empty filters', () => {
    const params = buildPexelsSearchParams('nature', { orientation: '', size: '', color: '' });
    expect(params.has('orientation')).toBe(false);
    expect(params.has('size')).toBe(false);
    expect(params.has('color')).toBe(false);
  });
});
