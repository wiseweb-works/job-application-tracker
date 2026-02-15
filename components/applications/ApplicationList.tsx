import { getApplications } from "@/app/actions/application.actions";
import { ApplicationCard } from "./ApplicationCard";
import { EmptyState } from "./EmptyState";
import type { FilterInput } from "@/lib/zod/application.schema";

interface ApplicationListProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function ApplicationList({ searchParams }: ApplicationListProps) {
  const params = await searchParams;
  
  const filters: FilterInput = {
    search: typeof params.search === "string" ? params.search : undefined,
    status: typeof params.status === "string" ? (params.status as FilterInput["status"]) : undefined,
    sortBy: typeof params.sortBy === "string" ? (params.sortBy as FilterInput["sortBy"]) : "applicationDate",
    sortOrder: typeof params.sortOrder === "string" ? (params.sortOrder as FilterInput["sortOrder"]) : "desc",
  };

  const applications = await getApplications(filters);

  if (applications.length === 0) {
    return (
      <div className="mt-6">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pb-20">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}
