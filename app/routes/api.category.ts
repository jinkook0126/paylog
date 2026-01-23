import type { ActionFunctionArgs } from 'react-router';
import { prisma } from '~/lib/prisma';

export async function loader() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return Response.json(categories);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST, PUT, DELETE 처리
export async function action({ request }: ActionFunctionArgs) {
  const { method } = request;
  const body = await request.json();
  const { name, icon, type, id } = body;
  try {
    if (method === 'POST') {
      // 카테고리 생성

      if (!body.name || !body.icon || !body.type) {
        return Response.json(
          { error: 'Missing required fields: name, icon, type' },
          { status: 400 }
        );
      }

      
      const category = await prisma.category.create({
        data: {
          name,
          icon,
          type,
        },
      });

      return Response.json(category, { status: 201 });
    }

    if (method === 'PUT' || method === 'PATCH') {
      // 카테고리 수정
      if (!id) {
        return Response.json({ error: 'Category ID is required' }, { status: 400 });
      }

      const category = await prisma.category.update({
        where: { id: Number(id) },
        data: {
          ...(name && { name }),
          ...(icon && { icon }),
          ...(type && { type }),
        },
      });

      return Response.json(category);
    }

    if (method === 'DELETE') {
      // 카테고리 삭제
      if (!id) {
        return Response.json({ error: 'Category ID is required' }, { status: 400 });
      }

      await prisma.category.delete({
        where: { id: Number(id) },
      });

      return Response.json({ message: 'Category deleted successfully' }, { status: 200 });
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error(`Failed to ${method.toLowerCase()} category:`, error);

    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }

    return Response.json(
      { error: `Failed to ${method.toLowerCase()} category` },
      { status: 500 }
    );
  }
}
