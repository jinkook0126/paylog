import { Skeleton } from '../ui/skeleton';

function MonthlyChartSkeleton() {
  return (
    <div className="rounded-2xl p-4 border border-border/50">
      <Skeleton className="h-4 w-18 mb-4" />
      <Skeleton className="aspect-video w-full" />
    </div>
  );
}

export default MonthlyChartSkeleton;
