import { Skeleton } from '~/components/ui/skeleton';

function TransactionSkeleton() {
  const arr = Array.from({ length: 3 }, (_, index) => index);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-4 border border-border/50">
          <Skeleton className="h-4 w-18 mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="rounded-xl p-4 border border-border/50">
          <Skeleton className="h-4 w-18 mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-4 w-18" />
        <Skeleton className="h-4 w-6" />
      </div>
      <div className="space-y-2">
        {arr.map((item) => (
          <div key={item} className="rounded-2xl px-4 border border-border/50">
            <div className="flex w-fit items-center gap-4 py-4 px-2">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="grid gap-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionSkeleton;
