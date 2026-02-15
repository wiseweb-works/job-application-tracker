import { ApplicationList } from "@/components/applications/ApplicationList";
import { ApplicationFilters } from "@/components/applications/ApplicationFilters";
import { Suspense } from "react";
import { CreateButton } from "@/components/applications/CreateButton"; // Need to create this client component wrapper

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your job search progress.
          </p>
        </div>
        <CreateButton />
      </header>

      <div className="space-y-6">
        <ApplicationFilters />
        
        <Suspense fallback={<ApplicationsSkeleton />}>
          <ApplicationList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

function ApplicationsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[200px] rounded-xl border bg-card/50 animate-pulse" />
      ))}
    </div>
  );
}
