"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { DeleteConfirmDialog } from "@/components/applications/DeleteConfirmDialog";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import type { JobApplication } from "@prisma/client";
import type { ApplicationStatus, UpdateApplicationInput } from "@/lib/zod/application.schema";
import { Calendar, MapPin, Building2, DollarSign, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface ApplicationCardProps {
  application: JobApplication;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-semibold text-lg leading-tight mb-1">
                {application.jobTitle}
              </h3>
              <div className="flex items-center text-muted-foreground">
                <Building2 className="mr-1.5 h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">{application.companyName}</span>
              </div>
            </div>
            <StatusBadge status={application.status as ApplicationStatus} className="shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="pb-3 space-y-2.5">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-4 w-4 shrink-0" />
            <span className="truncate">{application.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1.5 h-4 w-4 shrink-0" />
            <span>Applied {format(new Date(application.applicationDate), "MMM d, yyyy")}</span>
          </div>
          {application.salaryRange && (
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="mr-1.5 h-4 w-4 shrink-0" />
              <span>{application.salaryRange}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 border-t bg-muted/20 flex justify-between items-center px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated {format(new Date(application.updatedAt), "MMM d")}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsEditOpen(true)}
              aria-label={`Edit application for ${application.companyName}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label={`Delete application for ${application.companyName}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <DeleteConfirmDialog
        id={application.id}
        companyName={application.companyName}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

      <ApplicationForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        defaultValues={application as unknown as UpdateApplicationInput} // Cast because Prisma types vs Zod types
      />
    </>
  );
}
