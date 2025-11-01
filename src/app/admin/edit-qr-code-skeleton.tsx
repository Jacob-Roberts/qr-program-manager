import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Skeleton } from "#components/ui/skeleton.tsx";

export function EditQRCodeSkeleton() {
  return (
    <>
      <QRCardSkeleton />
      <QRCardSkeleton />
      <QRCardSkeleton />
    </>
  );
}

export function QRCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <CardDescription>
          <span className="space-y-1">
            <Skeleton asSpan className="h-4 w-48" />
            <Skeleton asSpan className="h-4 w-52" />
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Skeleton className="h-5 w-40" />

        <Skeleton className="h-10 w-28 rounded-lg" />

        <div className="flex justify-center">
          <Skeleton className="h-44 w-44 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
