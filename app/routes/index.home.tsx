import { useQuery } from '@tanstack/react-query';
import { getCategories } from '~/databases/category';
import { queryClient } from '~/lib/query-client';
import {queryKey as categoryQueryKey} from '~/query/category';
import { getTransactions } from '~/databases/transaction';
import HomeCard from '~/components/home/HomeCard';
import TransactionList from '~/components/transaction/TransactionList';

export async function loader() {
  await queryClient.ensureQueryData({ queryKey: categoryQueryKey, queryFn: getCategories })
  await queryClient.ensureQueryData({ queryKey: ['transactions'], queryFn: ()=>getTransactions() })
  return null;
}

function Home() {
  const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: ()=>getTransactions() })
  return (
    <div>
      <div className="mb-6">
        <HomeCard list={transactions}/>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold px-2">최근 거래</h2>
      </div>
      {/* <TransactionList
        list={transactions?.slice(0, 5)}
      /> */}
    </div>
  );
}

export default Home;