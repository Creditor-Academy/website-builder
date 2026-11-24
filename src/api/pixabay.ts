export interface PixabayFilters {
  page?: number;
  perPage?: number;
  imageType?: string;
  orientation?: string;
  category?: string;
  colors?: string;
  order?: string;
  safesearch?: boolean | string;
}

export function buildPixabaySearchParams(query: string, filters: PixabayFilters = {}): URLSearchParams {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.perPage) params.set('per_page', String(filters.perPage));
  if (filters.imageType && filters.imageType !== 'all') params.set('image_type', filters.imageType);
  if (filters.orientation && filters.orientation !== 'all') params.set('orientation', filters.orientation);
  if (filters.category) params.set('category', filters.category);
  if (filters.colors) params.set('colors', filters.colors);
  if (filters.order) params.set('order', filters.order);
  params.set('safesearch', filters.safesearch !== undefined ? String(filters.safesearch) : 'true');
  return params;
}
