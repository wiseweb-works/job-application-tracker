import { z } from "zod";

export const APPLICATION_STATUSES = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "GHOSTED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const applicationStatusSchema = z.enum(APPLICATION_STATUSES);

export const createApplicationSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name must be 200 characters or less"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(200, "Job title must be 200 characters or less"),
  status: applicationStatusSchema,
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be 200 characters or less"),
  salaryRange: z
    .string()
    .max(100, "Salary range must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  applicationDate: z.coerce.date({
    error: "Valid application date is required",
  }),
  notes: z
    .string()
    .max(2000, "Notes must be 2000 characters or less")
    .optional()
    .default(""),
});

export const updateApplicationSchema = createApplicationSchema.partial().extend({
  id: z.string().uuid("Invalid application ID"),
});

export const filterSchema = z.object({
  status: applicationStatusSchema.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["applicationDate", "companyName"]).optional().default("applicationDate"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type FilterInput = z.infer<typeof filterSchema>;
