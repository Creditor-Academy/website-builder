import { describe, it, expect } from 'vitest';
import { sanitizeHTML } from '@/utils/sanitize';

describe('sanitizeHTML', () => {
  it('strips script tags', () => {
    const result = sanitizeHTML('<p>Hi</p><script>alert("xss")</script>');
    expect(result).toBe('<p>Hi</p>');
  });

  it('keeps safe HTML', () => {
    const result = sanitizeHTML('<b>Bold</b> <a href="https://example.com">link</a>');
    expect(result).toContain('<b>Bold</b>');
    expect(result).toContain('<a');
  });

  it('strips event handlers', () => {
    const result = sanitizeHTML('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain('onerror');
  });

  it('handles empty input', () => {
    expect(sanitizeHTML('')).toBe('');
  });
});
