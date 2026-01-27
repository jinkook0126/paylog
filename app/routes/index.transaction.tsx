import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import MonthSelector from '~/components/history/MonthSelector';
import dayjs from '~/lib/dayjs';
import { getTransactions } from '~/databases/transaction';
import { queryClient } from '~/lib/query-client';
import MonthlySummary from '~/components/history/MonthlySummary';
import TransactionList from '~/components/transaction/TransactionList';

export async function loader() {
  const month = dayjs().format('YYYY-MM');
  const transactions = await queryClient.ensureQueryData({
    queryKey: ['transactions', month],
    queryFn: () => getTransactions(month),
  });
  return { month, transactions };
}
function TransactionsView() {
  const { month, transactions: loaderTransactions } = useLoaderData<typeof loader>();
  const [currentDate, setCurrentDate] = useState<Date>(dayjs(month).toDate());
  const queryMonth = dayjs(currentDate).format('YYYY-MM');
  const { data: transactions } = useQuery({
    queryKey: ['transactions', queryMonth],
    queryFn: () => getTransactions(queryMonth),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    initialData: queryMonth === month ? loaderTransactions : undefined,
  });
  const onDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  if (transactions === undefined) return <div>Loading...</div>;
  return (
    <div className="space-y-6">
      <MonthSelector currentDate={currentDate} onDateChange={onDateChange} />
      <div>
        <MonthlySummary list={transactions} />
      </div>
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold">전체 거래 내역</h2>
        <span className="text-sm text-muted-foreground">{transactions.length}건</span>
      </div>
      <TransactionList list={transactions} />
    </div>
  );
}

export default TransactionsView;
