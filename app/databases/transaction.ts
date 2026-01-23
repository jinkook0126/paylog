import { apiFetchJson } from "~/lib/apiFetch";
import type { Transactions } from "~/lib/prismaClient";

export async function addTransaction(transaction: Omit<Transactions, 'id'|'created_at'>): Promise<void> {
  await apiFetchJson<void>(`/api/transaction`, {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}