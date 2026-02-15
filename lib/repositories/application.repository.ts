import { prisma } from "@/lib/prisma";
import type {
  CreateApplicationInput,
  UpdateApplicationInput,
  FilterInput,
} from "@/lib/zod/application.schema";

export async function findAll(filters: FilterInput) {
  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.search) {
    where.OR = [
      { companyName: { contains: filters.search } },
      { jobTitle: { contains: filters.search } },
    ];
  }

  return prisma.jobApplication.findMany({
    where,
    orderBy: {
      [filters.sortBy ?? "applicationDate"]: filters.sortOrder ?? "desc",
    },
  });
}

export async function findById(id: string) {
  return prisma.jobApplication.findUnique({ where: { id } });
}

export async function create(data: CreateApplicationInput) {
  return prisma.jobApplication.create({ data });
}

export async function update(id: string, data: Omit<UpdateApplicationInput, "id">) {
  return prisma.jobApplication.update({
    where: { id },
    data,
  });
}

export async function remove(id: string) {
  return prisma.jobApplication.delete({ where: { id } });
}
