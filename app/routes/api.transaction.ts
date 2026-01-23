import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { prisma } from '~/lib/prisma';

// GET: 거래 목록 조회
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date'); // YYYY-MM 형식
    
    const whereClause: {
      created_at?: {
        gte: Date;
        lte: Date;
      };
    } = {};
    
    // 날짜 필터 (월 단위)
    if (date) {
      // YYYY-MM 형식 파싱
      const [year, month] = date.split('-').map(Number);
      
      // 해당 월의 첫날 (00:00:00)
      const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
      
      // 해당 월의 마지막 날 (23:59:59)
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      
      whereClause.created_at = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }
    const transactions = await prisma.transactions.findMany({
      where: whereClause,
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
      ...(date ? {} : { take: 5 }), // 날짜가 없으면 최근 5개만 조회
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

