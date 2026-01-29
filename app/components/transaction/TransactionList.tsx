import dayjs from '~/lib/dayjs';
import type { ITransactionList } from '~/databases/transaction';
import TransactionItem from './TransactionItem';

function TransactionList({ list }: { list: ITransactionList[] | undefined }) {
  console.log('[TransactionList module evaluated]', list);
  if (list === undefined || list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-4xl mb-4">📝</p>
        <p>거래 내역이 없습니다</p>
        <p className="text-sm">+ 버튼을 눌러 추가해보세요</p>
      </div>
    );
  }

  const grouped = list.reduce(
    (acc, item) => {
      const date = dayjs(item.created_at).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, ITransactionList[]>,
  );
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          <p className="text-sm font-medium text-muted-foreground mb-2 px-2">
            {dayjs(dateKey).format('M월 DD일 dddd')}
          </p>
          {/* <div className="rounded-2xl px-4 border border-border/50">
            {grouped[dateKey].map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div> */}
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
