import { Suspense } from "react";
import dayjs from "~/lib/dayjs";
import { useGetTransactionsQuery } from "~/query/transaction";
import MonthlyExpense from "./MonthlyExpense";
import MonthlyCategoryExpense from "./MonthlyCategoryExpense";

function StatsContent({ currentDate }: { currentDate: Date }) {
  const queryMonth = dayjs(currentDate).format('YYYY-MM');

  const { data: transactions } = useGetTransactionsQuery(queryMonth);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MonthlyExpense list={transactions} />
      <MonthlyCategoryExpense list={transactions} />
    </Suspense>
  )
}

export default StatsContent