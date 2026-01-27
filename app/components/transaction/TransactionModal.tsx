import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { useModalStore } from "~/store/modal"

function TransactionModal() {
  const { open, transaction, closeModal } = useModalStore();

  if (!transaction) return null;

  const isExpense = transaction.categories.type === 'expense';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>거래 상세</DialogTitle>
          <DialogDescription>
            거래 내역의 상세 정보를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                {transaction.categories.icon || '💫'}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg text-foreground">
                  {transaction.name || transaction.categories.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.categories.name}
                </p>
              </div>
              <p className={`text-2xl font-bold ${isExpense ? 'text-rose-500' : 'text-indigo-500'}`}>
                {isExpense ? '-' : '+'}{transaction.amount.toLocaleString()}원
              </p>
            </div>
            <div className="pt-4 border-t border-border/50 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">거래 유형</span>
                <span className="text-sm font-medium">{transaction.categories.type === 'expense' ? '지출' : '수입'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">거래 일시</span>
                <span className="text-sm font-medium">{new Date(transaction.created_at).toLocaleString('ko-KR')}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionModal