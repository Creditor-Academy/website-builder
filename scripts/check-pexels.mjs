const key = process.env.PEXELS_API_KEY || process.env.VITE_PEXELS_API_KEY;
if (!key) {
  console.error('Missing PEXELS_API_KEY. Add it to .env.local and run: npm run check:pexels');
  process.exit(1);
}

const url = 'https://api.pexels.com/v1/search?query=office&per_page=2';
const response = await fetch(url, { headers: { Authorization: key } });
const body = await response.json().catch(() => null);

console.log('status', response.status);
console.log('rate-limit remaining', response.headers.get('x-ratelimit-remaining'));
console.log(
  JSON.stringify(
    {
      page: body?.page,
      per_page: body?.per_page,
      total_results: body?.total_results,
      error: body?.error,
      photos: (body?.photos || []).map((photo) => ({
        id: photo.id,
        photographer: photo.photographer,
        alt: photo.alt,
        width: photo.width,
        height: photo.height,
        url: photo.url,
        src: photo.src?.medium,
      })),
    },
    null,
    2
  )
);

if (!response.ok) process.exit(1);
