import { useState } from 'react';
import { useLoaderData } from 'react-router';
import MonthSelector from '~/components/MonthSelector';
import dayjs from '~/lib/dayjs';
import { getTransactions } from '~/databases/transaction';
import { queryClient } from '~/lib/query-client';
import TransactionContents from '~/components/history/TransactionContents';

export async function loader() {
  const month = dayjs().format('YYYY-MM');
  await queryClient.ensureQueryData({
    queryKey: ['transactions', month],
    queryFn: () => getTransactions(month),
  });
  return { month };
}
function TransactionsView() {
  const { month } = useLoaderData<typeof loader>();
  const [currentDate, setCurrentDate] = useState<Date>(dayjs(month).toDate());
  const onDateChange = (date: Date) => {
    setCurrentDate(date);
  };
  return (
    <div className="space-y-6">
      <MonthSelector currentDate={currentDate} onDateChange={onDateChange} />
      <TransactionContents currentDate={currentDate} />
    </div>
  );
}

export default TransactionsView;
