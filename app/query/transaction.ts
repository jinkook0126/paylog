import {
  useMutation,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Transactions } from '~/lib/prismaClient';
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
  type ITransactionList,
} from '~/databases/transaction';
import { queryClient } from '~/lib/query-client';
import dayjs from '~/lib/dayjs';
import { queryKey as statsQueryKey } from './stats';

export const queryKey = ['transactions'];

export function useAddTransactionMutation(): UseMutationResult<
  void,
  Error,
  Omit<Transactions, 'id'>
> {
  const queryMonth = dayjs().format('YYYY-MM');
  const transactionQueryKey = [...queryKey, queryMonth];
  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionQueryKey });
      toast.success('거래 추가에 성공했습니다.');
    },
    onError: () => {
      toast.error('거래 추가에 실패했습니다.');
    },
  });
}

export function useGetTransactionsQuery(
  date: string,
): UseSuspenseQueryResult<ITransactionList[], Error> {
  return useSuspenseQuery<ITransactionList[], Error>({
    queryKey: [...queryKey, date],
    queryFn: () => getTransactions(date),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

export function useDeleteTransactionMutation(): UseMutationResult<
  void,
  Error,
  { id: number; date: Date }
> {
  return useMutation({
    mutationFn: ({ id }) => deleteTransaction(id),
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: [...queryKey, dayjs(date).format('YYYY-MM')] });
      queryClient.invalidateQueries({ queryKey: [...statsQueryKey, dayjs(date).format('YYYY')] });
      toast.success('거래 삭제에 성공했습니다.');
    },
    onError: () => {
      toast.error('거래 삭제에 실패했습니다.');
    },
  });
}

export function useUpdateTransactionMutation(): UseMutationResult<void, Error, Transactions> {
  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: (_, transaction) => {
      queryClient.invalidateQueries({
        queryKey: [...queryKey, dayjs(transaction.created_at).format('YYYY-MM')],
      });
      queryClient.invalidateQueries({
        queryKey: [...statsQueryKey, dayjs(transaction.created_at).format('YYYY')],
      });
      toast.success('거래 수정에 성공했습니다.');
    },
    onError: () => {
      toast.error('거래 수정에 실패했습니다.');
    },
  });
}
