"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STATUSES } from "@/lib/zod/application.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

export function ApplicationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "ALL") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort === "date_asc") {
      params.set("sortBy", "applicationDate");
      params.set("sortOrder", "asc");
    } else if (sort === "date_desc") {
      params.set("sortBy", "applicationDate");
      params.set("sortOrder", "desc");
    } else if (sort === "company_asc") {
      params.set("sortBy", "companyName");
      params.set("sortOrder", "asc");
    } else if (sort === "company_desc") {
      params.set("sortBy", "companyName");
      params.set("sortOrder", "desc");
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies or roles..."
          className="pl-9"
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Select
          defaultValue={searchParams.get("status") || "ALL"}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {APPLICATION_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={
            searchParams.get("sortBy") === "companyName"
              ? `company_${searchParams.get("sortOrder") || "asc"}`
              : `date_${searchParams.get("sortOrder") || "desc"}`
          }
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Newest First</SelectItem>
            <SelectItem value="date_asc">Oldest First</SelectItem>
            <SelectItem value="company_asc">Company (A-Z)</SelectItem>
            <SelectItem value="company_desc">Company (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
