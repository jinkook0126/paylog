import { getCategories } from '~/databases/category';
import { queryClient } from '~/lib/query-client';

export async function loader() {
  await queryClient.ensureQueryData({ queryKey: ['categories'], queryFn: getCategories })
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