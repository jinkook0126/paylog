import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { ITransactionList } from '~/databases/transaction';

function HomeCard({ list }: { list: ITransactionList[] | undefined }) {
  if (list === undefined) return <div>Loading...</div>;
  const income = list.reduce(
    (acc, item) => (item.categories.type === 'income' ? acc + item.amount : acc),
    0,
  );
  const expense = list.reduce(
    (acc, item) => (item.categories.type === 'expense' ? acc + item.amount : acc),
    0,
  );
  const balance = income - expense;
  return (
    <div className="p-4 border border-border/50 rounded-xl shadow-card space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">이번 달 잔액</p>
        <p className={`text-3xl font-bold ${balance < 0 && 'text-rose-500'}`}>
          {balance >= 0 ? '+' : ''}
          {balance.toLocaleString()}원
        </p>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 bg-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-sm text-muted-foreground">수입</span>
          </div>
          <p className="text-lg font-semibold text-indigo-500">+{income.toLocaleString()}원</p>
        </div>

        <div className="flex-1 bg-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-sm text-muted-foreground">지출</span>
          </div>
          <p className="text-lg font-semibold text-rose-500">-{expense.toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
