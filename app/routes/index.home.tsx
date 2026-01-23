import { useLoaderData } from 'react-router';
import { getCategories } from '~/databases/category';

export async function loader() {
  const categories = await getCategories();
  return { categories };
}

function Home() {
  const { categories } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <h1>Home</h1>
      <div>
        <h2>Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {category.name} - {category.icon}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;