export const MAX_ASSET_UPLOAD_SIZE_BYTES = 25 * 1024 * 1024;

export function getAssetUploadSizeError(file: Pick<File, 'name' | 'size'>): string | null {
  if (file.size <= MAX_ASSET_UPLOAD_SIZE_BYTES) return null;

  const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
  return `"${file.name}" is ${sizeInMb} MB. Maximum allowed size is 25 MB.`;
}
