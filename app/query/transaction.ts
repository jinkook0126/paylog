import { useMutation, useSuspenseQuery, type UseMutationResult, type UseSuspenseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Transactions } from "~/lib/prismaClient";
import { addTransaction, getTransactions, type ITransactionList } from "~/databases/transaction";

export function useAddTransactionMutation(): UseMutationResult<void, Error, Omit<Transactions, 'id'|'created_at'>> {
  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      toast.success('거래 추가에 성공했습니다.');
    },
    onError: (error) => {
      toast.error('거래 추가에 실패했습니다.', {
        description: error.message,
      });
    },
  });
}

export function useGetTransactionsQuery(date: string): UseSuspenseQueryResult<ITransactionList[], Error> {
  return useSuspenseQuery<ITransactionList[], Error>({
    queryKey: ['transactions', date],
    queryFn: () => getTransactions(date),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}