/**
 * Parish Validation Schemas Tests
 */

import { describe, it, expect } from 'vitest';
import {
  createParishSchema,
  updateParishSchema,
  parishFiltersSchema,
} from '@/lib/validations/parish.schema';

describe('Parish Validation Schemas', () => {
  describe('createParishSchema', () => {
    it('should validate a valid parish creation input', async () => {
      const validInput = {
        name: 'Giáo xứ Chính Tòa',
        address: '123 Đường ABC, TP. Buôn Ma Thuột',
        phone: '0262 3123 456',
        email: 'chinhtoa@gpbmt.org',
        foundingDate: new Date('1960-01-15'),
      };

      const result = await createParishSchema.validate(validInput);
      expect(result.name).toBe('Giáo xứ Chính Tòa');
      expect(result.address).toBe('123 Đường ABC, TP. Buôn Ma Thuột');
    });

    it('should require name', async () => {
      const invalidInput = {
        address: '123 Đường ABC',
        phone: '0262 3123 456',
      };

      await expect(createParishSchema.validate(invalidInput)).rejects.toThrow(
        'Tên giáo xứ là bắt buộc'
      );
    });

    it('should enforce minimum name length', async () => {
      const invalidInput = {
        name: 'A',
      };

      await expect(createParishSchema.validate(invalidInput)).rejects.toThrow(
        'Tên giáo xứ phải có ít nhất 2 ký tự'
      );
    });

    it('should enforce maximum name length', async () => {
      const invalidInput = {
        name: 'A'.repeat(101),
      };

      await expect(createParishSchema.validate(invalidInput)).rejects.toThrow(
        'Tên giáo xứ không được quá 100 ký tự'
      );
    });

    it('should allow optional address', async () => {
      const validInput = {
        name: 'Giáo xứ Test',
      };

      const result = await createParishSchema.validate(validInput);
      expect(result.name).toBe('Giáo xứ Test');
      expect(result.address).toBeUndefined();
    });

    it('should validate phone format', async () => {
      const invalidInput = {
        name: 'Giáo xứ Test',
        phone: 'invalid-phone!@#',
      };

      await expect(createParishSchema.validate(invalidInput)).rejects.toThrow(
        'Số điện thoại không hợp lệ'
      );
    });

    it('should allow valid phone formats', async () => {
      const validInputs = [
        { name: 'Test', phone: '0262-3123-456' },
        { name: 'Test', phone: '0262 3123 456' },
        { name: 'Test', phone: '02623123456' },
        { name: 'Test', phone: '+84 262 3123 456' },
      ];

      for (const input of validInputs) {
        const result = await createParishSchema.validate(input);
        expect(result.phone).toBeDefined();
      }
    });

    it('should validate email format', async () => {
      const invalidInput = {
        name: 'Giáo xứ Test',
        email: 'not-an-email',
      };

      await expect(createParishSchema.validate(invalidInput)).rejects.toThrow(
        'Email không hợp lệ'
      );
    });

    it('should allow valid email', async () => {
      const validInput = {
        name: 'Giáo xứ Test',
        email: 'giaoxu@gpbmt.org',
      };

      const result = await createParishSchema.validate(validInput);
      expect(result.email).toBe('giaoxu@gpbmt.org');
    });

    it('should reject future founding date', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const invalidInput = {
        name: 'Giáo xứ Test',
        foundingDate: futureDate,
      };

      await expect(createParishSchema.validate(invalidInput)).rejects.toThrow(
        'Ngày thành lập không thể trong tương lai'
      );
    });

    it('should allow past founding date', async () => {
      const validInput = {
        name: 'Giáo xứ Test',
        foundingDate: new Date('1960-01-15'),
      };

      const result = await createParishSchema.validate(validInput);
      expect(result.foundingDate).toBeInstanceOf(Date);
    });

    it('should trim whitespace from name', async () => {
      const validInput = {
        name: '  Giáo xứ Test  ',
      };

      const result = await createParishSchema.validate(validInput);
      expect(result.name).toBe('Giáo xứ Test');
    });
  });

  describe('updateParishSchema', () => {
    it('should validate partial update', async () => {
      const validInput = {
        name: 'Updated Name',
      };

      const result = await updateParishSchema.validate(validInput);
      expect(result.name).toBe('Updated Name');
    });

    it('should allow all fields to be optional', async () => {
      const validInput = {};

      const result = await updateParishSchema.validate(validInput);
      expect(result).toEqual({});
    });

    it('should validate email format when provided', async () => {
      const invalidInput = {
        email: 'not-an-email',
      };

      await expect(updateParishSchema.validate(invalidInput)).rejects.toThrow(
        'Email không hợp lệ'
      );
    });

    it('should allow isActive boolean', async () => {
      const validInput = {
        isActive: false,
      };

      const result = await updateParishSchema.validate(validInput);
      expect(result.isActive).toBe(false);
    });

    it('should enforce name minimum length when provided', async () => {
      const invalidInput = {
        name: 'A',
      };

      await expect(updateParishSchema.validate(invalidInput)).rejects.toThrow(
        'Tên giáo xứ phải có ít nhất 2 ký tự'
      );
    });

    it('should allow null values for optional fields', async () => {
      const validInput = {
        address: null,
        phone: null,
        email: null,
        foundingDate: null,
      };

      const result = await updateParishSchema.validate(validInput);
      expect(result.address).toBeNull();
      expect(result.phone).toBeNull();
    });
  });

  describe('parishFiltersSchema', () => {
    it('should set default pagination values', async () => {
      const input = {};

      const result = await parishFiltersSchema.validate(input);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should allow all filter options', async () => {
      const validInput = {
        search: 'Chính Tòa',
        isActive: true,
        page: 2,
        limit: 50,
      };

      const result = await parishFiltersSchema.validate(validInput);
      expect(result.search).toBe('Chính Tòa');
      expect(result.isActive).toBe(true);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
    });

    it('should enforce maximum limit', async () => {
      const invalidInput = {
        limit: 150,
      };

      await expect(parishFiltersSchema.validate(invalidInput)).rejects.toThrow();
    });

    it('should enforce minimum page', async () => {
      const invalidInput = {
        page: 0,
      };

      await expect(parishFiltersSchema.validate(invalidInput)).rejects.toThrow();
    });

    it('should allow isActive filter as boolean', async () => {
      const validInputTrue = { isActive: true };
      const validInputFalse = { isActive: false };

      const resultTrue = await parishFiltersSchema.validate(validInputTrue);
      const resultFalse = await parishFiltersSchema.validate(validInputFalse);

      expect(resultTrue.isActive).toBe(true);
      expect(resultFalse.isActive).toBe(false);
    });
  });
});
