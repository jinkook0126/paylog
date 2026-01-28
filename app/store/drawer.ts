import { create } from 'zustand';
import type { ITransactionList } from '~/databases/transaction';

interface DrawerState {
  drawerOpen: boolean;
  drawerTransaction: ITransactionList | null;
  openDrawer: (transaction?: ITransactionList) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  drawerOpen: false,
  drawerTransaction: null,
  openDrawer: (transaction) => set({ drawerOpen: true, drawerTransaction: transaction || null }),
  closeDrawer: () => set({ drawerOpen: false, drawerTransaction: null }),
}));
