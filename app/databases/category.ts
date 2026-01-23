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

export async function deleteCategory(id: number): Promise<void> {
  await apiFetchJson<void>(`/api/category`, {
    method: 'DELETE',
    body: JSON.stringify({
      id,
    }),
  });
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const newCategory = await apiFetchJson<Category>(`/api/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  return newCategory as Category;
}