import type { Category } from '@prisma/client';
import { prisma } from '~/lib/prisma';


export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return categories;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error}`);
  }
}