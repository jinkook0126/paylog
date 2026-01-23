import { apiFetchJson } from '~/lib/apiFetch';
import type { Category } from '~/lib/prismaClient';

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await apiFetchJson<Category[]>('/api/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return categories;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error}`);
  }
}
