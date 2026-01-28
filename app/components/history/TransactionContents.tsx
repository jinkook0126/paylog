import { Suspense } from "react"
import { useSuspenseQuery } from "@tanstack/react-query";
import MonthlySummary from "./MonthlySummary"
import TransactionList from "../transaction/TransactionList"
import { getTransactions } from "~/databases/transaction";
import dayjs from "~/lib/dayjs";

function TransactionContents({ currentDate }: { currentDate: Date }) {
  const queryMonth = dayjs(currentDate).format('YYYY-MM');

  const { data: transactions } = useSuspenseQuery({
    queryKey: ['transactions', queryMonth],
    queryFn: () => getTransactions(queryMonth),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
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