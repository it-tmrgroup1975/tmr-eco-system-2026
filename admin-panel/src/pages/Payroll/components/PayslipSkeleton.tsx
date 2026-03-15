export const PayslipSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-20 w-full bg-slate-100 animate-pulse rounded-2xl" />
    ))}
  </div>
);