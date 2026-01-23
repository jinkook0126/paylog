import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { prisma } from '~/lib/prisma';

// GET: 거래 목록 조회
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    
    const transactions = await prisma.transactions.findMany({
      where: {
        ...(categoryId && { category: Number(categoryId) }),
      },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            icon: true,
            type: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    
    return Response.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return Response.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST: 거래 추가
export async function action({ request }: ActionFunctionArgs) {
  const { method } = request;
  
  try {
    if (method === 'POST') {
      const body = await request.json();
      const { name, category, amount, memo, picture, paymentMethod } = body;

      // 필수 필드 검증
      if (!name || !category || amount === undefined) {
        return Response.json(
          { error: 'Missing required fields: name, category, amount' },
          { status: 400 }
        );
      }

      const transaction = await prisma.transactions.create({
        data: {
          name,
          category: Number(category),
          amount: Number(amount),
          memo: memo || null,
          picture: picture || null,
          paymentMethod,
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              icon: true,
              type: true,
            },
          },
        },
      });

      return Response.json(transaction, { status: 201 });
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return Response.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

