import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobApplication } from '@prisma/client';
import { createApplicationSchema, filterSchema } from '@/lib/zod/application.schema';
import * as repository from '@/lib/repositories/application.repository';
import * as actions from '@/app/actions/application.actions';

// Mock repository
vi.mock('@/lib/repositories/application.repository', () => ({
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
}));

describe('Job Application Tracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Zod Schema Validation', () => {
    it('should validate valid application data', () => {
      const validData = {
        companyName: 'Acme Corp',
        jobTitle: 'Senior Engineer',
        status: 'APPLIED',
        location: 'Remote',
        applicationDate: new Date(),
        notes: 'Great opportunity',
      };
      
      const result = createApplicationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        companyName: 'Acme Corp',
        jobTitle: 'Senior Engineer',
        status: 'INVALID_STATUS',
        location: 'Remote',
        applicationDate: new Date(),
      };
      
      const result = createApplicationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        // Zod error message format may vary, just check it failed validation
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('should validate filters', () => {
      const validFilter = {
        status: 'APPLIED',
        search: 'Acme',
        sortBy: 'companyName',
        sortOrder: 'asc',
      };
      
      const result = filterSchema.safeParse(validFilter);
      expect(result.success).toBe(true);
    });
  });

  describe('Server Actions', () => {
    it('createApplication should call repository and return success', async () => {
      const input = {
        companyName: 'Test Corp',
        jobTitle: 'Developer',
        status: 'APPLIED',
        location: 'Remote',
        applicationDate: new Date(),
        salaryRange: '$100k',
        notes: '',
      } as const; // as const helps type inference for literals

      const mockCreated = { id: '123', ...input, createdAt: new Date(), updatedAt: new Date() };
      vi.mocked(repository.create).mockResolvedValue(mockCreated);

      const result = await actions.createApplication(input);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCreated);
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
        companyName: 'Test Corp'
      }));
    });

    it('deleteApplication should call repository remove', async () => {
      vi.mocked(repository.remove).mockResolvedValue({ id: '123' } as unknown as JobApplication);

      const result = await actions.deleteApplication('123');

      expect(result.success).toBe(true);
      expect(repository.remove).toHaveBeenCalledWith('123');
    });
  });
});
