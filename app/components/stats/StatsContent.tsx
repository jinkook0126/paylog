import dayjs from '~/lib/dayjs';
import { useGetTransactionsQuery } from '~/query/transaction';
import MonthlyExpense from './MonthlyExpense';
import MonthlyCategoryExpense from './MonthlyCategoryExpense';

function StatsContent({ currentDate }: { currentDate: Date }) {
  const queryMonth = dayjs(currentDate).format('YYYY-MM');

  const { data: transactions } = useGetTransactionsQuery(queryMonth);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-4xl mb-4">📊</p>
        <p>{dayjs(currentDate).format('YYYY년 MM월')} 지출 내역이 없습니다</p>
      </div>
    );
  }
  return (
    <>
      <MonthlyExpense list={transactions} />
      <MonthlyCategoryExpense list={transactions} />
    </>
  );
}

export default StatsContent;
