import dayjs from 'dayjs';
import { Banknote, CreditCard, FileText, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useModalStore } from '~/store/modal';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { useDeleteTransactionMutation } from '~/query/transaction';
import { useDrawerStore } from '~/store/drawer';

function TransactionModal() {
  const { open, transaction, closeModal } = useModalStore();
  const { openDrawer } = useDrawerStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutate: deleteTransactionMutate } = useDeleteTransactionMutation();
  if (!transaction) return null;

  const isExpense = transaction.categories.type === 'expense';
  const handleDelete = () => {
    deleteTransactionMutate(
      {
        id: transaction.id,
        date: transaction.created_at,
      },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };
  const handleEdit = () => {
    openDrawer(transaction);
    closeModal();
  };

  return (
    <>
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
              <p
                className={`text-3xl font-bold ${isExpense ? 'text-rose-500' : 'text-indigo-500'}`}
              >
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
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                수정
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>거래 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 거래를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default TransactionModal;
