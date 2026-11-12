/**
 * Extracts a user-friendly error message from an API error response.
 * Handles Zod validation error arrays, backend error objects, and Axios errors.
 */
export function extractApiErrorMessage(error: any, fallback = 'Operation failed. Please try again.'): string {
  if (!error) return fallback;

  const data = error.response?.data;
  if (data) {
    // 1. Array of validation errors (e.g. backend Zod validation)
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const messages = data.errors
        .map((item: any) => {
          if (typeof item === 'string') {
            const match = item.match(/^([a-zA-Z0-9_.-]+):\s*(.+)$/);
            if (match) {
              const [, field, msg] = match;
              // If the message already mentions the field name (e.g. "subdomain: Subdomain can only contain...")
              if (msg.toLowerCase().includes(field.toLowerCase())) {
                return msg;
              }
              const prettyField = field.charAt(0).toUpperCase() + field.slice(1);
              return `${prettyField}: ${msg}`;
            }
            return item;
          }
          if (item && typeof item === 'object') {
            return item.message || item.error || JSON.stringify(item);
          }
          return String(item);
        })
        .filter(Boolean);

      if (messages.length > 0) {
        return messages.join('. ');
      }
    }

    // 2. Specific error message or error string (ignoring generic "Invalid data" if a specific message exists)
    if (typeof data.message === 'string' && data.message.trim() && data.message.trim() !== 'Invalid data') {
      return data.message.trim();
    }

    if (typeof data.error === 'string' && data.error.trim() && data.error.trim() !== 'Invalid data') {
      return data.error.trim();
    }

    if (typeof data.message === 'string' && data.message.trim()) {
      return data.message.trim();
    }

    if (typeof data.error === 'string' && data.error.trim()) {
      return data.error.trim();
    }

    if (typeof data === 'string' && data.trim()) {
      return data.trim();
    }
  }

  // 3. Fallback to Javascript Error message if meaningful
  if (
    typeof error.message === 'string' &&
    error.message.trim() &&
    !error.message.toLowerCase().includes('failed to publish')
  ) {
    return error.message.trim();
  }

  return fallback;
}

