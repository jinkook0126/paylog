import { Suspense } from "react"
import MonthlySummary from "./MonthlySummary"
import TransactionList from "../transaction/TransactionList"
import dayjs from "~/lib/dayjs";
import { useGetTransactionsQuery } from "~/query/transaction";

function TransactionContents({ currentDate }: { currentDate: Date }) {
  const queryMonth = dayjs(currentDate).format('YYYY-MM');

  const { data: transactions } = useGetTransactionsQuery(queryMonth);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MonthlySummary list={transactions} />
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-semibold">전체 거래 내역</h2>
        <span className="text-sm text-muted-foreground">{transactions.length}건</span>
      </div>
      <TransactionList list={transactions} />
    </Suspense>
  )
}

export default TransactionContents