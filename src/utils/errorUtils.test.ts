import { describe, it, expect } from 'vitest';
import { extractApiErrorMessage } from './errorUtils';

describe('extractApiErrorMessage', () => {
  it('extracts zod validation error from backend response', () => {
    const error = {
      response: {
        status: 400,
        data: {
          error: 'Invalid data',
          errors: [
            'subdomain: Subdomain can only contain lowercase letters, numbers, and hyphens',
          ],
        },
      },
    };

    expect(extractApiErrorMessage(error)).toBe(
      'Subdomain can only contain lowercase letters, numbers, and hyphens'
    );
  });

  it('formats field prefix cleanly when not mentioned in message', () => {
    const error = {
      response: {
        status: 400,
        data: {
          error: 'Invalid data',
          errors: ['customDomain: Domain is required'],
        },
      },
    };

    expect(extractApiErrorMessage(error)).toBe('CustomDomain: Domain is required');
  });

  it('joins multiple validation errors', () => {
    const error = {
      response: {
        status: 400,
        data: {
          error: 'Invalid data',
          errors: [
            'subdomain: Subdomain can only contain lowercase letters, numbers, and hyphens',
            'customDomain: Domain is required',
          ],
        },
      },
    };

    expect(extractApiErrorMessage(error)).toBe(
      'Subdomain can only contain lowercase letters, numbers, and hyphens. CustomDomain: Domain is required'
    );
  });

  it('extracts top-level error message', () => {
    const error = {
      response: {
        status: 409,
        data: {
          error: 'Subdomain already taken',
          message: 'Subdomain already taken',
        },
      },
    };

    expect(extractApiErrorMessage(error)).toBe('Subdomain already taken');
  });

  it('uses fallback when error is empty or generic', () => {
    expect(extractApiErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
    expect(extractApiErrorMessage({}, 'Custom fallback')).toBe('Custom fallback');
  });
});

