import { apiFetchJson } from "~/lib/apiFetch";

export type TStats = {
  month: string;
  card: number;
  cash: number;
}
export async function getStats(year: string): Promise<TStats[]> {
  try {
    const stats = await apiFetchJson<TStats[]>(`/api/stats?year=${year}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return stats;
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error}`);
  }
}