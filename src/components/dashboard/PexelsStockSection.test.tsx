/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  PexelsStockSection,
  cardAspect,
  formatDuration,
  photoUrl,
} from './PexelsStockSection';
import type { PexelsPhoto, PexelsVideo } from '@/api/pexels';

vi.mock('@/api/stock', () => ({
  getCuratedStockPhotos: vi.fn(),
  getPopularStockVideos: vi.fn(),
  searchStockPhotos: vi.fn(),
  searchStockVideos: vi.fn(),
}));

import {
  getCuratedStockPhotos,
  getPopularStockVideos,
  searchStockPhotos,
  searchStockVideos,
} from '@/api/stock';

const mockPhoto: PexelsPhoto = {
  id: 101,
  width: 1920,
  height: 1080,
  url: 'https://www.pexels.com/photo/101/',
  photographer: 'Jane Doe',
  photographer_url: 'https://www.pexels.com/@jane',
  alt: 'Sunny mountain landscape',
  src: {
    original: 'https://images.pexels.com/photos/101/original.jpg',
    large2x: 'https://images.pexels.com/photos/101/large2x.jpg',
    large: 'https://images.pexels.com/photos/101/large.jpg',
    medium: 'https://images.pexels.com/photos/101/medium.jpg',
    small: 'https://images.pexels.com/photos/101/small.jpg',
    portrait: 'https://images.pexels.com/photos/101/portrait.jpg',
    landscape: 'https://images.pexels.com/photos/101/landscape.jpg',
    tiny: 'https://images.pexels.com/photos/101/tiny.jpg',
  },
};

const mockVideo: PexelsVideo = {
  id: 202,
  width: 1920,
  height: 1080,
  duration: 59.8,
  url: 'https://www.pexels.com/video/202/',
  image: 'https://images.pexels.com/videos/202/thumb.jpg',
  user: { id: 1, name: 'John Film', url: '' },
  video_files: [
    { id: 1, quality: 'hd', file_type: 'video/mp4', link: 'https://videos.pexels.com/202/hd.mp4' },
  ],
};

describe('PexelsStockSection helper functions', () => {
  it('formats durations correctly and rolls over 59.8s to 1:00 instead of 0:60', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(45)).toBe('0:45');
    expect(formatDuration(59.8)).toBe('1:00');
    expect(formatDuration(119.7)).toBe('2:00');
    expect(formatDuration(65)).toBe('1:05');
  });

  it('selects highest quality image url in photoUrl', () => {
    expect(photoUrl(mockPhoto)).toBe('https://images.pexels.com/photos/101/original.jpg');

    const photoWithoutOriginal = {
      ...mockPhoto,
      src: { ...mockPhoto.src, original: '' },
    };
    expect(photoUrl(photoWithoutOriginal)).toBe('https://images.pexels.com/photos/101/large2x.jpg');
  });

  it('calculates safe clamped cardAspect ratios even when dimensions are missing or 0', () => {
    expect(cardAspect({ width: 1920, height: 1080 })).toBe('1.7 / 1');
    expect(cardAspect({ width: 1080, height: 1920 })).toBe('0.62 / 1');
    // Missing or invalid dimensions must not produce "NaN / 1"
    const ratioUndefined = cardAspect({});
    expect(ratioUndefined).not.toContain('NaN');
    expect(ratioUndefined).toBe('1.5 / 1');

    const ratioZero = cardAspect({ width: 0, height: 0 });
    expect(ratioZero).not.toContain('NaN');
  });
});

describe('PexelsStockSection component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock IntersectionObserver
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    window.IntersectionObserver = MockIntersectionObserver as any;

    vi.mocked(getCuratedStockPhotos).mockResolvedValue({
      page: 1,
      per_page: 20,
      total_results: 1,
      photos: [mockPhoto],
    });

    vi.mocked(searchStockPhotos).mockResolvedValue({
      page: 1,
      per_page: 20,
      total_results: 1,
      photos: [mockPhoto],
    });

    vi.mocked(getPopularStockVideos).mockResolvedValue({
      page: 1,
      per_page: 20,
      total_results: 1,
      videos: [mockVideo],
    });

    vi.mocked(searchStockVideos).mockResolvedValue({
      page: 1,
      per_page: 20,
      total_results: 1,
      videos: [mockVideo],
    });
  });

  it('allows user to switch between Images and Videos even when query has video keyword', async () => {
    render(
      <PexelsStockSection
        query="nature video"
        importingId={null}
        onAddToLibrary={vi.fn()}
      />
    );

    // Initial render detects "video" and searches videos
    await waitFor(() => {
      expect(searchStockVideos).toHaveBeenCalled();
    });

    // Clicking "Images" button should switch to image search
    const imagesBtn = screen.getByRole('button', { name: 'Images' });
    fireEvent.click(imagesBtn);

    await waitFor(() => {
      expect(searchStockPhotos).toHaveBeenCalled();
    });
  });

  it('prevents Enter/Space on SelectBadge from opening the preview dialog', async () => {
    render(
      <PexelsStockSection
        query=""
        importingId={null}
        onAddToLibrary={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Select' })).toBeDefined();
    });

    const selectBadge = screen.getByRole('button', { name: 'Select' });

    // Pressing Space on the Select badge should toggle it and not open preview dialog
    fireEvent.keyDown(selectBadge, { key: ' ' });
    fireEvent.click(selectBadge);

    expect(screen.getByRole('button', { name: 'Deselect' })).toBeDefined();
    // Preview dialog title should not be rendered
    expect(screen.queryByRole('heading', { name: 'Sunny mountain landscape' })).toBeNull();
  });

  it('renders Copy link button in preview dialog when onCopy is passed', async () => {
    const handleCopy = vi.fn();
    render(
      <PexelsStockSection
        query=""
        importingId={null}
        onAddToLibrary={vi.fn()}
        onCopy={handleCopy}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Select' })).toBeDefined();
    });

    // Click the photo card to open preview
    const photoImg = screen.getByAltText('Sunny mountain landscape');
    fireEvent.click(photoImg);

    // Dialog should open with "Copy link" button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copy link/i })).toBeDefined();
    });

    fireEvent.click(screen.getByRole('button', { name: /copy link/i }));
    expect(handleCopy).toHaveBeenCalledWith('101', 'https://images.pexels.com/photos/101/original.jpg');
  });

  it('passes orientation, size, and color filters to searchStockPhotos and renders filter chips', async () => {
    render(
      <PexelsStockSection
        query="cat"
        importingId={null}
        onAddToLibrary={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(searchStockPhotos).toHaveBeenCalled();
    });

    // Select Portrait orientation
    const portraitBtn = screen.getByRole('button', { name: 'Portrait' });
    fireEvent.click(portraitBtn);

    // Select Large size
    const largeBtn = screen.getByRole('button', { name: 'Large' });
    fireEvent.click(largeBtn);

    // Select Violet color
    const violetBtn = screen.getByLabelText('Filter by violet color');
    fireEvent.click(violetBtn);

    await waitFor(() => {
      expect(searchStockPhotos).toHaveBeenCalledWith(
        'cat',
        expect.objectContaining({
          orientation: 'portrait',
          size: 'large',
          color: 'violet',
        })
      );
    });

    // Filtered for chips should be visible for portrait, large, and violet
    const removePortraitChip = screen.getByLabelText('Remove portrait filter');
    const removeLargeChip = screen.getByLabelText('Remove large filter');
    const removeVioletChip = screen.getByLabelText('Remove violet color filter');

    expect(removePortraitChip).toBeDefined();
    expect(removeLargeChip).toBeDefined();
    expect(removeVioletChip).toBeDefined();

    // Clicking remove portrait chip clears orientation
    fireEvent.click(removePortraitChip);
    await waitFor(() => {
      expect(searchStockPhotos).toHaveBeenCalledWith(
        'cat',
        expect.objectContaining({
          orientation: '',
          size: 'large',
          color: 'violet',
        })
      );
    });
  });
});
