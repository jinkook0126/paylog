import { apiFetchJson } from '~/lib/apiFetch';
import type { Transactions } from '~/lib/prismaClient';

export interface ITransactionList extends Transactions {
  categories: {
    id: number;
    name: string;
    icon: string;
    type: string;
  };
}
export async function getTransactions(date?: string): Promise<ITransactionList[]> {
  console.log(date);
  try {
    const transactions = await apiFetchJson<ITransactionList[]>(
      `/api/transaction?${date ? `date=${date}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return transactions;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch transactions: ${error}`);
  }
}
export async function addTransaction(
  transaction: Omit<Transactions, 'id' | 'created_at'>,
): Promise<void> {
  await apiFetchJson<void>(`/api/transaction`, {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}
