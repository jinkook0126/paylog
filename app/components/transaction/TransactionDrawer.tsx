import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import TransactionDrawerForm from './TransactionDrawerForm';
import { useDrawerStore } from '~/store/drawer';

function TransactionDrawer() {
  const { drawerOpen, drawerTransaction, closeDrawer } = useDrawerStore();
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');

  // drawerTransaction이 있으면 해당 타입으로 설정
  useEffect(() => {
    if (drawerTransaction) {
      setTransactionType(drawerTransaction.categories.type as 'expense' | 'income');
    }
  }, [drawerTransaction]);

  return (
    <Drawer open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DrawerTrigger className="-top-4 relative" asChild>
        <Button className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-card-lg">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto h-[80vh]">
        <div className="h-full overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle className="text-xl text-left">
              {drawerTransaction ? '거래 수정' : '거래 추가'}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 mt-2 mb-4">
            <div className="flex items-center gap-2 mb-6">
              <Button
                variant="subtle"
                className={cn(
                  'flex-1 py-5 text-lg font-medium',
                  transactionType === 'expense' && 'bg-rose-500 text-white',
                )}
                onClick={() => setTransactionType('expense')}
              >
                지출
              </Button>
              <Button
                variant="subtle"
                className={cn(
                  'flex-1 py-5 text-lg font-medium',
                  transactionType === 'income' && 'bg-indigo-500 text-white',
                )}
                onClick={() => setTransactionType('income')}
              >
                수입
              </Button>
            </div>
            <TransactionDrawerForm
              transactionType={transactionType}
              setOpen={closeDrawer}
              transaction={drawerTransaction}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default TransactionDrawer;
