/**
 * User Validation Schemas Tests
 */

import { describe, it, expect } from 'vitest';
import {
  createUserSchema,
  updateUserSchema,
  resetPasswordSchema,
  userFiltersSchema,
  roleRequiresParish,
} from '@/lib/validations/user.schema';
import { UserRole } from '@/types/models.types';

describe('User Validation Schemas', () => {
  describe('createUserSchema', () => {
    it('should validate a valid user creation input', async () => {
      const validInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phone: '0912345678',
        roleId: '507f1f77bcf86cd799439011',
        parishId: '507f1f77bcf86cd799439012',
      };

      const result = await createUserSchema.validate(validInput);
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
    });

    it('should require email', async () => {
      const invalidInput = {
        password: 'password123',
        name: 'Test User',
        roleId: '507f1f77bcf86cd799439011',
      };

      await expect(createUserSchema.validate(invalidInput)).rejects.toThrow(
        'Email là bắt buộc'
      );
    });

    it('should validate email format', async () => {
      const invalidInput = {
        email: 'not-an-email',
        password: 'password123',
        name: 'Test User',
        roleId: '507f1f77bcf86cd799439011',
      };

      await expect(createUserSchema.validate(invalidInput)).rejects.toThrow(
        'Email không hợp lệ'
      );
    });

    it('should require password with minimum length', async () => {
      const invalidInput = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
        roleId: '507f1f77bcf86cd799439011',
      };

      await expect(createUserSchema.validate(invalidInput)).rejects.toThrow(
        'Mật khẩu phải có ít nhất 6 ký tự'
      );
    });

    it('should require name', async () => {
      const invalidInput = {
        email: 'test@example.com',
        password: 'password123',
        roleId: '507f1f77bcf86cd799439011',
      };

      await expect(createUserSchema.validate(invalidInput)).rejects.toThrow(
        'Tên là bắt buộc'
      );
    });

    it('should require roleId', async () => {
      const invalidInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await expect(createUserSchema.validate(invalidInput)).rejects.toThrow(
        'Vai trò là bắt buộc'
      );
    });

    it('should validate phone format', async () => {
      const invalidInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phone: 'invalid-phone!',
        roleId: '507f1f77bcf86cd799439011',
      };

      await expect(createUserSchema.validate(invalidInput)).rejects.toThrow(
        'Số điện thoại không hợp lệ'
      );
    });

    it('should allow optional parishId', async () => {
      const validInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        roleId: '507f1f77bcf86cd799439011',
      };

      const result = await createUserSchema.validate(validInput);
      expect(result.parishId).toBeUndefined();
    });
  });

  describe('updateUserSchema', () => {
    it('should validate partial update', async () => {
      const validInput = {
        name: 'Updated Name',
      };

      const result = await updateUserSchema.validate(validInput);
      expect(result.name).toBe('Updated Name');
    });

    it('should allow all fields to be optional', async () => {
      const validInput = {};

      const result = await updateUserSchema.validate(validInput);
      expect(result).toEqual({});
    });

    it('should validate email format when provided', async () => {
      const invalidInput = {
        email: 'not-an-email',
      };

      await expect(updateUserSchema.validate(invalidInput)).rejects.toThrow(
        'Email không hợp lệ'
      );
    });

    it('should allow isActive boolean', async () => {
      const validInput = {
        isActive: false,
      };

      const result = await updateUserSchema.validate(validInput);
      expect(result.isActive).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should allow empty input for auto-generated password', async () => {
      const validInput = {};

      const result = await resetPasswordSchema.validate(validInput);
      expect(result).toEqual({});
    });

    it('should validate password minimum length when provided', async () => {
      const invalidInput = {
        newPassword: '123',
      };

      await expect(resetPasswordSchema.validate(invalidInput)).rejects.toThrow(
        'Mật khẩu phải có ít nhất 6 ký tự'
      );
    });

    it('should accept valid password', async () => {
      const validInput = {
        newPassword: 'newpassword123',
      };

      const result = await resetPasswordSchema.validate(validInput);
      expect(result.newPassword).toBe('newpassword123');
    });
  });

  describe('userFiltersSchema', () => {
    it('should set default pagination values', async () => {
      const input = {};

      const result = await userFiltersSchema.validate(input);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should allow all filter options', async () => {
      const validInput = {
        search: 'test',
        roleId: '507f1f77bcf86cd799439011',
        parishId: '507f1f77bcf86cd799439012',
        isActive: true,
        page: 2,
        limit: 50,
      };

      const result = await userFiltersSchema.validate(validInput);
      expect(result.search).toBe('test');
      expect(result.page).toBe(2);
      expect(result.limit).toBe(50);
    });

    it('should enforce maximum limit', async () => {
      const invalidInput = {
        limit: 150,
      };

      await expect(userFiltersSchema.validate(invalidInput)).rejects.toThrow();
    });
  });

  describe('roleRequiresParish', () => {
    it('should return true for PARISH_PRIEST', () => {
      expect(roleRequiresParish(UserRole.PARISH_PRIEST)).toBe(true);
    });

    it('should return true for PARISH_SECRETARY', () => {
      expect(roleRequiresParish(UserRole.PARISH_SECRETARY)).toBe(true);
    });

    it('should return false for SUPER_ADMIN', () => {
      expect(roleRequiresParish(UserRole.SUPER_ADMIN)).toBe(false);
    });

    it('should return false for DIOCESE_MANAGER', () => {
      expect(roleRequiresParish(UserRole.DIOCESE_MANAGER)).toBe(false);
    });

    it('should return false for ACCOUNTANT', () => {
      expect(roleRequiresParish(UserRole.ACCOUNTANT)).toBe(false);
    });
  });
});
