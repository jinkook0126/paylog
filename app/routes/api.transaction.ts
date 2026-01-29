import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '~/lib/prisma';
import dayjs from '~/lib/dayjs';

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function uploadImage(base64: string) {
  const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);

  if (!matches) {
    throw new Error('Invalid base64 image format');
  }

  const mimeType = matches[1]; // image/jpeg, image/png
  const data = matches[2];
  const buffer = Buffer.from(data, 'base64');
  const extension = mimeType.split('/')[1]; // jpeg, png
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from('image').upload(fileName, buffer, {
    contentType: mimeType,
  });
  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('image').getPublicUrl(fileName);

  return publicUrl;
}

// GET: 거래 목록 조회
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date'); // YYYY-MM 형식
    const base = dayjs(date, 'YYYY-MM');
    const startOfMonth = base.startOf('month');
    const endOfMonth = base.add(1, 'month').startOf('month');

    const transactions = await prisma.transactions.findMany({
      where: {
        created_at: {
          gte: startOfMonth.toDate(),
          lte: endOfMonth.toDate(),
        },
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
    return Response.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST: 거래 추가
export async function action({ request }: ActionFunctionArgs) {
  const { method } = request;

  try {
    if (method === 'POST') {
      const body = await request.json();
      const { name, category, amount, memo, picture, paymentMethod, created_at: createdAt } = body;

      // 필수 필드 검증
      if (!name || !category || amount === undefined) {
        return Response.json(
          { error: 'Missing required fields: name, category, amount' },
          { status: 400 },
        );
      }
      let pictureUrl = null;
      if (picture) {
        pictureUrl = await uploadImage(picture);
      }

      const transaction = await prisma.transactions.create({
        data: {
          name,
          category: Number(category),
          amount: Number(amount),
          memo: memo || null,
          picture: pictureUrl || null,
          paymentMethod,
          created_at: createdAt,
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

    if (method === 'DELETE') {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (!id) {
        return Response.json({ error: 'Missing required parameter: id' }, { status: 400 });
      }
      const transaction = await prisma.transactions.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (transaction?.picture) {
        const path = transaction.picture.split('/').pop();
        const { error: deleteError } = await supabase.storage.from('image').remove([path!]);
        if (deleteError) {
          throw deleteError;
        }
      }
      try {
        await prisma.transactions.delete({
          where: {
            id: Number(id),
          },
        });
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        return Response.json({ error: 'Failed to delete transaction' }, { status: 500 });
      }
      return Response.json({ success: true }, { status: 200 });
    }

    if (method === 'PUT') {
      const body = await request.json();
      const {
        id,
        name,
        category,
        amount,
        memo,
        picture,
        paymentMethod,
        created_at: createdAt,
      } = body;
      if (!id || !name || !category || amount === undefined) {
        return Response.json(
          { error: 'Missing required fields: id, name, category, amount' },
          { status: 400 },
        );
      }
      const transaction = await prisma.transactions.findUnique({
        where: {
          id: Number(id),
        },
      });
      let pictureUrl = picture;

      if (pictureUrl !== transaction?.picture) {
        if (transaction?.picture) {
          const path = transaction.picture.split('/').pop();
          await supabase.storage.from('image').remove([path!]);
        }
        pictureUrl = await uploadImage(pictureUrl!);
      }
      try {
        await prisma.transactions.update({
          where: { id: Number(id) },
          data: {
            name,
            category: Number(category),
            amount: Number(amount),
            memo: memo || null,
            picture: picture || null,
            paymentMethod,
            created_at: createdAt,
          },
        });
      } catch (error) {
        console.error('Failed to update transaction:', error);
        return Response.json({ error: 'Failed to update transaction' }, { status: 500 });
      }
      return Response.json({ success: true }, { status: 200 });
    }
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Failed to create transaction:', error);

    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return Response.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    return Response.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
