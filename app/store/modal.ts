import { create } from 'zustand';
import type { ITransactionList } from '~/databases/transaction';

interface ModalState {
  open: boolean;
  transaction: ITransactionList | null;
  openModal: (transaction: ITransactionList) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  transaction: null,
  openModal: (transaction) => set({ open: true, transaction }),
  closeModal: () => set({ open: false, transaction: null }),
}));
