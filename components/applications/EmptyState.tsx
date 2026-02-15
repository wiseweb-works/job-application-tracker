"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ApplicationForm } from "./ApplicationForm";
import { useState } from "react";

export function EmptyState() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-card/50 border-dashed min-h-[400px]">
      <div className="rounded-full bg-muted p-4 mb-4">
        <PlusCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No applications found</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Get started by tracking your first job application or try adjusting your filters.
      </p>
      <Button onClick={() => setIsOpen(true)}>
        Add Application
      </Button>

      <ApplicationForm open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}
