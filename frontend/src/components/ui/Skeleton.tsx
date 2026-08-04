export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-3 w-48" />
      <div className="flex gap-3">
        <Skeleton className="h-16 w-16 rounded-xl" />
        <Skeleton className="h-16 w-16 rounded-xl" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div className="space-y-4">
        <Skeleton className="h-4 w-40 rounded-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-12 w-40 rounded-xl" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}
