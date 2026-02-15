"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ApplicationForm } from "./ApplicationForm";

export function CreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        New Application
      </Button>
      <ApplicationForm open={open} onOpenChange={setOpen} />
    </>
  );
}
