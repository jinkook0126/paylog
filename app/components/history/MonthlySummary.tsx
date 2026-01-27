import type { ITransactionList } from '~/databases/transaction';

function MonthlySummary({ list }: { list: ITransactionList[] }) {
  const totalIncome = list.reduce((acc, item) => {
    if (item.categories.type === 'income') {
      return acc + item.amount;
    }
    return acc;
  }, 0);
  const totalExpense = list.reduce((acc, item) => {
    if (item.categories.type === 'expense') {
      return acc + item.amount;
    }
    return acc;
  }, 0);
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl p-4 border border-border/50">
        <p className="text-sm text-muted-foreground mb-1">이번 달 수입</p>
        <p className="text-xl font-bold text-indigo-500">+{totalIncome.toLocaleString()}원</p>
      </div>
      <div className="rounded-xl p-4 border border-border/50">
        <p className="text-sm text-muted-foreground mb-1">이번 달 지출</p>
        <p className="text-xl font-bold text-rose-500">-{totalExpense.toLocaleString()}원</p>
      </div>
    </div>
  );
}

export default MonthlySummary;
