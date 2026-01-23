import { getCategories } from '~/databases/category';
import { queryClient } from '~/lib/query-client';
import {queryKey as categoryQueryKey} from '~/query/category';
import { getTransactions } from '~/databases/transaction';

export async function loader() {
  await queryClient.ensureQueryData({ queryKey: categoryQueryKey, queryFn: getCategories })
  await queryClient.ensureQueryData({ queryKey: ['transactions'], queryFn: ()=>getTransactions() })
  return null;
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

export default Home;