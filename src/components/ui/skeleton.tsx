import { cn } from "#/lib/utils";

function Skeleton({
  className,
  asSpan = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { asSpan?: boolean }) {
  const c = cn(
    "animate-pulse rounded-md bg-stone-100 dark:bg-stone-800",
    className,
  );
  if (asSpan) {
    return <span className={c} {...props} />;
  }
  return <div className={c} {...props} />;
}

export { Skeleton };
