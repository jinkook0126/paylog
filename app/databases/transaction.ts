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
export async function getTransactions(date: string): Promise<ITransactionList[]> {
  try {
    const transactions = await apiFetchJson<ITransactionList[]>(`/api/transaction?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return transactions;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch transactions: ${error}`);
  }
}
export async function addTransaction(transaction: Omit<Transactions, 'id'>): Promise<void> {
  await apiFetchJson<void>(`/api/transaction`, {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiFetchJson<void>(`/api/transaction?id=${id}`, {
    method: 'DELETE',
  });
}

export async function updateTransaction(transaction: Transactions): Promise<void> {
  await apiFetchJson<void>(`/api/transaction`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  });
}
