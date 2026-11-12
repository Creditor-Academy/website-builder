import { beforeEach, describe, expect, it, vi } from 'vitest';

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock('./client', () => ({
  default: { get },
}));

import messagesApi from './messages';

describe('messagesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and normalizes messages from GET /messages', async () => {
    get.mockResolvedValue({
      data: {
        messages: [{ id: 'm1', name: 'A User', is_read: false }],
      },
    });

    const result = await messagesApi.getMessages({ websiteId: 'site-1' });

    expect(get).toHaveBeenCalledWith('/messages', {
      params: { websiteId: 'site-1' },
    });
    expect(result.data.data).toEqual([
      expect.objectContaining({ id: 'm1', name: 'A User', status: 'unread' }),
    ]);
  });

  it('rejects malformed message responses', async () => {
    get.mockResolvedValue({ data: { messages: null } });

    await expect(messagesApi.getMessages()).rejects.toThrow(
      'Messages API returned an invalid response.'
    );
  });
});
