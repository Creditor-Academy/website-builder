/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PublishDialog } from './PublishDialog';
import { publishService } from '@/services/publishService';
import useBuilderStore from '@/store/useBuilderStore';

vi.mock('@/services/publishService', () => ({
  publishService: {
    publishWebsite: vi.fn(),
  },
}));

vi.mock('@/api/website', () => ({
  default: {
    updateWebsite: vi.fn().mockResolvedValue({ data: {} }),
    publishWebsite: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock('@/api/client', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  fetchCsrfToken: vi.fn().mockResolvedValue('token'),
  clearCsrfToken: vi.fn(),
  SITE_HOST: 'webstudio.lmsathena.com',
}));

describe('PublishDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBuilderStore.setState({
      websites: [
        {
          id: 'site-1',
          name: 'Test Site',
          status: 'Draft',
          subdomain: '',
          customDomain: '',
        },
      ] as any,
    });
  });

  it('displays exact error message when backend returns validation errors', async () => {
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
    (publishService.publishWebsite as any).mockRejectedValueOnce(error);

    render(
      <PublishDialog open={true} onOpenChange={() => {}} websiteId="site-1" />
    );

    const input = screen.getByLabelText('Web Studio subdomain');
    fireEvent.change(input, { target: { value: 'first project' } });

    const publishBtn = screen.getByRole('button', { name: /Publish Website/i });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Subdomain can only contain lowercase letters, numbers, and hyphens')
      ).toBeInTheDocument();
    });
  });

  it('allows updating an already published website without changing the subdomain', async () => {
    useBuilderStore.setState({
      websites: [
        {
          id: 'cmvhua7wt002epjm8aabowxwz',
          name: 'Elevate',
          status: 'Published',
          subdomain: 'my-project1',
          publishedUrl: 'https://my-project1.webstudio.lmsathena.com',
          customDomain: '',
        },
      ] as any,
    });

    (publishService.publishWebsite as any).mockResolvedValueOnce({
      success: true,
      url: 'https://my-project1.webstudio.lmsathena.com',
    });

    render(
      <PublishDialog
        open={true}
        onOpenChange={() => {}}
        websiteId="cmvhua7wt002epjm8aabowxwz"
      />
    );

    // The button should be labeled "Update Website" and must NOT be disabled
    const updateBtn = screen.getByRole('button', { name: /Update Website/i });
    expect(updateBtn).not.toBeDisabled();

    // Click update website without changing the subdomain
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(publishService.publishWebsite).toHaveBeenCalledWith({
        websiteId: 'cmvhua7wt002epjm8aabowxwz',
        subdomain: 'my-project1',
        customDomain: undefined,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Website updated successfully!')).toBeInTheDocument();
    });
  });
});
