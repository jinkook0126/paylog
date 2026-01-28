import { Skeleton } from '../ui/skeleton';

function StatsContentSkeleton() {
  return (
    <>
      <div className="rounded-2xl p-4 border border-border/50">
        <Skeleton className="h-4 w-18 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="rounded-2xl p-4 border border-border/50">
        <Skeleton className="h-4 w-18 mb-4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </>
  );
}

export default StatsContentSkeleton;
