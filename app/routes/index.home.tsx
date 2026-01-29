import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from 'react-router';
import { getCategories } from '~/databases/category';
import { queryClient } from '~/lib/query-client';
import { queryKey as categoryQueryKey } from '~/query/category';
import { getTransactions } from '~/databases/transaction';
import HomeCard from '~/components/home/HomeCard';
import TransactionList from '~/components/transaction/TransactionList';
import dayjs from '~/lib/dayjs';

export async function loader() {
  await queryClient.ensureQueryData({ queryKey: categoryQueryKey, queryFn: getCategories });
  const month = dayjs().format('YYYY-MM');
  const transactions = await queryClient.ensureQueryData({
    queryKey: ['transactions', month],
    queryFn: () => getTransactions(month),
  });
  return { month, transactions };
}

function Home() {
  const { month, transactions: loaderTransactions } = useLoaderData<typeof loader>();

  const { data: transactions } = useQuery({
    queryKey: ['transactions', month],
    queryFn: () => getTransactions(month),
    initialData: loaderTransactions,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
  return (
    <div>
      <div className="mb-6">
        <HomeCard list={transactions} />
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold px-2">최근 거래</h2>
      </div>
      <TransactionList list={transactions?.slice(0, 5)} />
    </div>
  );
}

export default Home;
