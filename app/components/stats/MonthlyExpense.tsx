import { Banknote, CreditCard, Wallet } from 'lucide-react';
import type { ITransactionList } from '~/databases/transaction';
import dayjs from '~/lib/dayjs';
import { formatKRW } from '~/lib/utils';

function MonthlyExpense({ list }: { list: ITransactionList[] }) {
  const card = list
    .filter((item) => item.categories.type === 'expense' && item.paymentMethod === 'card')
    .reduce((acc, item) => acc + item.amount, 0);
  const cash = list
    .filter((item) => item.categories.type === 'expense' && item.paymentMethod === 'cash')
    .reduce((acc, item) => acc + item.amount, 0);
  return (
    <div className="rounded-2xl p-4 border border-border/50">
      <p className="text-sm text-muted-foreground mb-2">
        {dayjs(list[0].created_at).format('YYYY년 M월')} 총 지출
      </p>
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-6 h-6 text-rose-500" />
        <p className="text-3xl font-bold text-rose-500">{formatKRW(card + cash)}원</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-xl p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs">카드</span>
          </div>
          <p className="text-lg font-semibold">{formatKRW(card)}원</p>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Banknote className="w-4 h-4" />
            <span className="text-xs">현금</span>
          </div>
          <p className="text-lg font-semibold">{formatKRW(cash)}원</p>
        </div>
      </div>
    </div>
  );
}

export default MonthlyExpense;
