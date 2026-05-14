import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function AccessGuideStepSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-border/60 p-4">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-5 w-36" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
      </div>
    </div>
  )
}

function AccessGuideCodeBlockSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>
          <Skeleton className="h-5 w-32" />
        </CardTitle>
        <Skeleton className="h-4 w-full max-w-sm" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border/70 bg-muted/20 p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function AccessGuidePage() {
  return (
    <div className="flex flex-1 flex-col p-4 pt-0">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>
              <Skeleton className="h-5 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <AccessGuideStepSkeleton />
              <AccessGuideStepSkeleton />
              <AccessGuideStepSkeleton />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card size="sm">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle>
                <Skeleton className="h-5 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-full max-w-44" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle>
                <Skeleton className="h-5 w-28" />
              </CardTitle>
              <Skeleton className="h-4 w-full max-w-52" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[88%]" />
                <Skeleton className="h-4 w-[72%]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <AccessGuideCodeBlockSkeleton />
        <AccessGuideCodeBlockSkeleton />
      </div>
    </div>
  )
}
