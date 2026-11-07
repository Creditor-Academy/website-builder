import { describe, expect, it } from 'vitest';
import { getAssetUploadSizeError, MAX_ASSET_UPLOAD_SIZE_BYTES } from './assetUpload';

describe('asset upload size validation', () => {
  it('accepts files at the API size limit', () => {
    expect(getAssetUploadSizeError({ name: 'clip.mp4', size: MAX_ASSET_UPLOAD_SIZE_BYTES })).toBeNull();
  });

  it('rejects files larger than the API size limit before upload', () => {
    expect(getAssetUploadSizeError({ name: 'clip.mp4', size: MAX_ASSET_UPLOAD_SIZE_BYTES + 1 }))
      .toBe('"clip.mp4" is 25.0 MB. Maximum allowed size is 25 MB.');
  });
});
