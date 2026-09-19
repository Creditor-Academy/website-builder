import { describe, expect, it } from 'vitest';
import { buildPexelsSearchParams, buildPexelsVideoSearchParams } from './pexels';

describe('Pexels search filters', () => {
  it('sends orientation, size, and color so users can narrow media', () => {
    const params = buildPexelsSearchParams('office', {
      page: 2,
      perPage: 12,
      orientation: 'landscape',
      size: 'large',
      color: 'blue',
    });
    expect(params.get('q')).toBe('office');
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

  it('builds video search params without color', () => {
    const params = buildPexelsVideoSearchParams('city', {
      page: 1,
      perPage: 20,
      orientation: 'portrait',
      size: 'medium',
    });
    expect(params.get('q')).toBe('city');
    expect(params.get('orientation')).toBe('portrait');
    expect(params.get('size')).toBe('medium');
    expect(params.has('color')).toBe(false);
  });
});
