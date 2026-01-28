import type { LoaderFunctionArgs } from 'react-router';
import { prisma } from '~/lib/prisma';
import dayjs from '~/lib/dayjs';

// GET: 년도별 월별 지출 통계 조회
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const year = url.searchParams.get('year'); // YYYY 형식
    if (!year) {
      return Response.json({ error: 'Year parameter is required' }, { status: 400 });
    }

    // 해당 년도의 시작일과 종료일 계산
    const startOfYear = dayjs(`${year}-01-01`).startOf('year');
    const endOfYear = dayjs(`${year}-12-31`).endOf('year');

    // 해당 년도의 모든 expense 거래 조회
    const transactions = await prisma.transactions.findMany({
      where: {
        created_at: {
          gte: startOfYear.toDate(),
          lte: endOfYear.toDate(),
        },
        categories: {
          type: 'expense',
        },
      },
      select: {
        amount: true,
        paymentMethod: true,
        created_at: true,
      },
    });

    // 월별로 그룹화하고 paymentMethod별 합계 계산
    const monthlyData: Record<number, { card: number; cash: number }> = {};

    // 1월부터 12월까지 초기화
    for (let month = 0; month < 12; month += 1) {
      monthlyData[month] = { card: 0, cash: 0 };
    }

    // 거래 데이터를 월별로 그룹화
    transactions.forEach((transaction) => {
      const month = dayjs(transaction.created_at).month(); // 0-11
      const paymentMethod = transaction.paymentMethod || 'card';
      const amount = transaction.amount || 0;

      if (paymentMethod === 'card') {
        monthlyData[month].card += amount;
      } else if (paymentMethod === 'cash') {
        monthlyData[month].cash += amount;
      }
    });

    // 월 이름 배열 (영어)
    const monthNames = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ];

    // 결과 배열 생성
    const result = monthNames.map((monthName, index) => ({
      month: monthName,
      card: monthlyData[index].card,
      cash: monthlyData[index].cash,
    }));

    return Response.json(result);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
