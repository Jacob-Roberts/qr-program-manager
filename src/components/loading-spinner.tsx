import { cn } from "#/lib/utils";

import { Icon } from "./Icon";

export function LoadingSpinner({ className }: { className?: string }) {
  return <Icon name="spinner" className={cn("animate-spin", className)} />;
}
