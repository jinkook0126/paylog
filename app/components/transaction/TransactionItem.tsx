import type { ITransactionList } from '~/databases/transaction';
import { useModalStore } from '~/store/modal';
import { formatKRW } from '~/lib/utils';

function TransactionItem({ transaction }: { transaction: ITransactionList }) {
  const isExpense = transaction.categories.type === 'expense';
  const { openModal } = useModalStore();

  const onClick = () => {
    openModal(transaction);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="cursor-pointer w-full flex items-center gap-4 py-4 px-2 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors text-left"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">
        {transaction.categories.icon || '💫'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {transaction.name || transaction.categories.name}
        </p>
        <p className="text-sm text-muted-foreground">{transaction.categories.name}</p>
      </div>

      <p className={`font-semibold ${isExpense ? 'text-rose-500' : 'text-indigo-500'}`}>
        {isExpense ? '-' : '+'}
        {formatKRW(transaction.amount)}원
      </p>
    </button>
  );
}

export default TransactionItem;
