import {
  useMutation,
  useSuspenseQuery,
  type UseMutationResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Transactions } from '~/lib/prismaClient';
import { addTransaction, getTransactions, type ITransactionList } from '~/databases/transaction';
import { queryClient } from '~/lib/query-client';
import dayjs from '~/lib/dayjs';

export function useAddTransactionMutation(): UseMutationResult<
  void,
  Error,
  Omit<Transactions, 'id'>
> {
  const queryMonth = dayjs().format('YYYY-MM');
  const queryKey = ['transactions', queryMonth];
  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
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
    queryKey: ['transactions', date],
    queryFn: () => getTransactions(date),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
