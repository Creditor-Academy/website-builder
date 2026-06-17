import DOMPurify from 'dompurify';

export function sanitizeHTML(dirty: string | undefined | null): string {
  return DOMPurify.sanitize(dirty || '');
}
