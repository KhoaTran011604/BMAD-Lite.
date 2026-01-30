/**
 * Parishioner Validation Schemas Tests
 */

import { describe, it, expect } from 'vitest';
import {
  createParishionerSchema,
  updateParishionerSchema,
  parishionerFiltersSchema,
} from '@/lib/validations/parishioner.schema';
import { Gender } from '@/types/models.types';

describe('Parishioner Validation Schemas', () => {
  describe('createParishionerSchema', () => {
    const validParishId = '507f1f77bcf86cd799439011';

    it('should validate a valid parishioner creation input', async () => {
      const validInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        baptismName: 'Giuse',
        dateOfBirth: new Date('1990-01-15'),
        gender: Gender.MALE,
        phone: '0912 345 678',
        address: '123 Đường ABC, TP. Buôn Ma Thuột',
      };

      const result = await createParishionerSchema.validate(validInput);
      expect(result.parish).toBe(validParishId);
      expect(result.fullName).toBe('Nguyễn Văn A');
      expect(result.baptismName).toBe('Giuse');
      expect(result.gender).toBe(Gender.MALE);
    });

    it('should require parish', async () => {
      const invalidInput = {
        fullName: 'Nguyễn Văn A',
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Giáo xứ là bắt buộc'
      );
    });

    it('should require fullName', async () => {
      const invalidInput = {
        parish: validParishId,
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Họ tên là bắt buộc'
      );
    });

    it('should validate parish ObjectId format', async () => {
      const invalidInput = {
        parish: 'invalid-id',
        fullName: 'Nguyễn Văn A',
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'ID giáo xứ không hợp lệ'
      );
    });

    it('should enforce minimum fullName length', async () => {
      const invalidInput = {
        parish: validParishId,
        fullName: 'A',
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Họ tên phải có ít nhất 2 ký tự'
      );
    });

    it('should enforce maximum fullName length', async () => {
      const invalidInput = {
        parish: validParishId,
        fullName: 'A'.repeat(101),
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Họ tên không được quá 100 ký tự'
      );
    });

    it('should allow optional baptismName', async () => {
      const validInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
      };

      const result = await createParishionerSchema.validate(validInput);
      expect(result.baptismName).toBeUndefined();
    });

    it('should enforce maximum baptismName length', async () => {
      const invalidInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        baptismName: 'A'.repeat(101),
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Tên thánh không được quá 100 ký tự'
      );
    });

    it('should validate gender enum', async () => {
      const invalidInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        gender: 'INVALID',
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Giới tính không hợp lệ'
      );
    });

    it('should allow valid gender values', async () => {
      const maleInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        gender: Gender.MALE,
      };

      const femaleInput = {
        parish: validParishId,
        fullName: 'Nguyễn Thị B',
        gender: Gender.FEMALE,
      };

      const maleResult = await createParishionerSchema.validate(maleInput);
      const femaleResult = await createParishionerSchema.validate(femaleInput);

      expect(maleResult.gender).toBe(Gender.MALE);
      expect(femaleResult.gender).toBe(Gender.FEMALE);
    });

    it('should reject future dateOfBirth', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const invalidInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        dateOfBirth: futureDate,
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Ngày sinh không được trong tương lai'
      );
    });

    it('should allow past dateOfBirth', async () => {
      const validInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        dateOfBirth: new Date('1990-01-15'),
      };

      const result = await createParishionerSchema.validate(validInput);
      expect(result.dateOfBirth).toBeInstanceOf(Date);
    });

    it('should validate familyHead ObjectId format', async () => {
      const invalidInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        familyHead: 'invalid-id',
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'ID chủ hộ không hợp lệ'
      );
    });

    it('should allow valid familyHead ObjectId', async () => {
      const validFamilyHeadId = '507f1f77bcf86cd799439022';
      const validInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        familyHead: validFamilyHeadId,
      };

      const result = await createParishionerSchema.validate(validInput);
      expect(result.familyHead).toBe(validFamilyHeadId);
    });

    it('should enforce maximum address length', async () => {
      const invalidInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        address: 'A'.repeat(501),
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Địa chỉ không được quá 500 ký tự'
      );
    });

    it('should enforce maximum phone length', async () => {
      const invalidInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        phone: '1'.repeat(21),
      };

      await expect(createParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Số điện thoại không được quá 20 ký tự'
      );
    });

    it('should trim whitespace from fullName', async () => {
      const validInput = {
        parish: validParishId,
        fullName: '  Nguyễn Văn A  ',
      };

      const result = await createParishionerSchema.validate(validInput);
      expect(result.fullName).toBe('Nguyễn Văn A');
    });

    it('should transform empty strings to undefined', async () => {
      const validInput = {
        parish: validParishId,
        fullName: 'Nguyễn Văn A',
        baptismName: '',
        phone: '',
        address: '',
      };

      const result = await createParishionerSchema.validate(validInput);
      expect(result.baptismName).toBeUndefined();
      expect(result.phone).toBeUndefined();
      expect(result.address).toBeUndefined();
    });
  });

  describe('updateParishionerSchema', () => {
    const validParishId = '507f1f77bcf86cd799439011';

    it('should validate partial update', async () => {
      const validInput = {
        fullName: 'Updated Name',
      };

      const result = await updateParishionerSchema.validate(validInput);
      expect(result.fullName).toBe('Updated Name');
    });

    it('should allow all fields to be optional', async () => {
      const validInput = {};

      const result = await updateParishionerSchema.validate(validInput);
      expect(result).toEqual({});
    });

    it('should validate parish ObjectId when provided', async () => {
      const invalidInput = {
        parish: 'invalid-id',
      };

      await expect(updateParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'ID giáo xứ không hợp lệ'
      );
    });

    it('should allow valid parish ObjectId', async () => {
      const validInput = {
        parish: validParishId,
      };

      const result = await updateParishionerSchema.validate(validInput);
      expect(result.parish).toBe(validParishId);
    });

    it('should enforce fullName minimum length when provided', async () => {
      const invalidInput = {
        fullName: 'A',
      };

      await expect(updateParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Họ tên phải có ít nhất 2 ký tự'
      );
    });

    it('should validate gender enum when provided', async () => {
      const invalidInput = {
        gender: 'INVALID',
      };

      await expect(updateParishionerSchema.validate(invalidInput)).rejects.toThrow(
        'Giới tính không hợp lệ'
      );
    });

    it('should allow null values to clear optional fields', async () => {
      const validInput = {
        baptismName: null,
        phone: null,
        address: null,
        gender: null,
        dateOfBirth: null,
        familyHead: null,
      };

      const result = await updateParishionerSchema.validate(validInput);
      expect(result.baptismName).toBeUndefined();
      expect(result.phone).toBeUndefined();
      expect(result.address).toBeUndefined();
      expect(result.gender).toBeUndefined();
      expect(result.dateOfBirth).toBeUndefined();
      expect(result.familyHead).toBeUndefined();
    });
  });

  describe('parishionerFiltersSchema', () => {
    const validParishId = '507f1f77bcf86cd799439011';

    it('should set default pagination values', async () => {
      const input = {};

      const result = await parishionerFiltersSchema.validate(input);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should allow all filter options', async () => {
      const validInput = {
        search: 'Nguyễn',
        parish: validParishId,
        gender: Gender.MALE,
        page: 2,
        limit: 50,
      };

      const result = await parishionerFiltersSchema.validate(validInput);
      expect(result.search).toBe('Nguyễn');
      expect(result.parish).toBe(validParishId);
      expect(result.gender).toBe(Gender.MALE);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
    });

    it('should validate parish ObjectId format', async () => {
      const invalidInput = {
        parish: 'invalid-id',
      };

      await expect(parishionerFiltersSchema.validate(invalidInput)).rejects.toThrow(
        'ID giáo xứ không hợp lệ'
      );
    });

    it('should validate gender enum in filters', async () => {
      const invalidInput = {
        gender: 'INVALID',
      };

      await expect(parishionerFiltersSchema.validate(invalidInput)).rejects.toThrow(
        'Giới tính không hợp lệ'
      );
    });

    it('should enforce maximum limit', async () => {
      const invalidInput = {
        limit: 150,
      };

      await expect(parishionerFiltersSchema.validate(invalidInput)).rejects.toThrow();
    });

    it('should enforce minimum page', async () => {
      const invalidInput = {
        page: 0,
      };

      await expect(parishionerFiltersSchema.validate(invalidInput)).rejects.toThrow();
    });

    it('should allow search filter', async () => {
      const validInput = {
        search: 'Nguyễn Văn',
      };

      const result = await parishionerFiltersSchema.validate(validInput);
      expect(result.search).toBe('Nguyễn Văn');
    });

    it('should trim search string', async () => {
      const validInput = {
        search: '  Nguyễn  ',
      };

      const result = await parishionerFiltersSchema.validate(validInput);
      expect(result.search).toBe('Nguyễn');
    });
  });
});
