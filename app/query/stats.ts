import { useSuspenseQuery, type UseSuspenseQueryResult } from "@tanstack/react-query";
import type { TStats } from "~/databases/stats";
import { getStats } from "~/databases/stats";

export const queryKey = ['stats'];
export function useGetStatsQuery(year: string): UseSuspenseQueryResult<TStats[], Error> {
  return useSuspenseQuery({
  queryKey: [...queryKey, year],
  queryFn: () => getStats(year),
});
}