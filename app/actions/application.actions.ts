"use server";

import { JobApplication } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  createApplicationSchema,
  updateApplicationSchema,
  filterSchema,
  type CreateApplicationInput,
  type UpdateApplicationInput,
  type FilterInput,
} from "@/lib/zod/application.schema";
import * as repository from "@/lib/repositories/application.repository";

export type ActionState<T> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createApplication(
  data: CreateApplicationInput
): Promise<ActionState<JobApplication>> {
  const result = createApplicationSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const application = await repository.create(result.data);
    revalidatePath("/applications");
    return { success: true, data: application };
  } catch (error) {
    console.error("Failed to create application:", error);
    return { success: false, error: "Failed to create application" };
  }
}

export async function updateApplication(
  data: UpdateApplicationInput
): Promise<ActionState<JobApplication>> {
  const result = updateApplicationSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const { id, ...updateData } = result.data;
    const application = await repository.update(id, updateData);
    revalidatePath("/applications");
    return { success: true, data: application };
  } catch (error) {
    console.error("Failed to update application:", error);
    return { success: false, error: "Failed to update application" };
  }
}

export async function deleteApplication(id: string): Promise<ActionState<void>> {
  try {
    await repository.remove(id);
    revalidatePath("/applications");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete application:", error);
    return { success: false, error: "Failed to delete application" };
  }
}

// Data fetching actions (no revalidation needed, but good to have as server functions)
export async function getApplications(filters: FilterInput) {
  const result = filterSchema.safeParse(filters);
  
  if (result.success) {
    return repository.findAll(result.data);
  }
  
  // Fallback to defaults if validation fails
  return repository.findAll({
    sortBy: "applicationDate",
    sortOrder: "desc",
  });
}

export async function getApplicationById(id: string) {
  return repository.findById(id);
}
