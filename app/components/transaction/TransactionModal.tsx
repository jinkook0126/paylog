import dayjs from 'dayjs';
import { Banknote, CreditCard, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useModalStore } from '~/store/modal';

function TransactionModal() {
  const { open, transaction, closeModal } = useModalStore();

  if (!transaction) return null;

  const isExpense = transaction.categories.type === 'expense';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent className="gap-2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-3xl">{transaction.categories.icon || '💫'}</span>
            <span>{transaction.name || transaction.categories.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          <div className="text-center py-4 bg-muted rounded-xl">
            <p className={`text-3xl font-bold ${isExpense ? 'text-rose-500' : 'text-indigo-500'}`}>
              {isExpense ? '-' : '+'}
              {transaction.amount.toLocaleString()}원
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {dayjs(transaction.created_at).format('YYYY년 M월 D일 dddd')}
            </p>
            {isExpense && transaction.paymentMethod && (
              <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                {transaction.paymentMethod === 'card' ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>카드 결제</span>
                  </>
                ) : (
                  <>
                    <Banknote className="w-4 h-4" />
                    <span>현금 결제</span>
                  </>
                )}
              </div>
            )}
          </div>
          {transaction.memo && (
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <FileText className="w-4 h-4" />
                메모
              </p>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-foreground whitespace-pre-wrap">{transaction.memo}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TransactionModal;
