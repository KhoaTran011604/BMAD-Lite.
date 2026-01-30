import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/db/connection';
// Import all models to ensure they are registered before populate
import { User } from '@/lib/db/models';
import type { IRole, IParish } from '@/types/models.types';

/**
 * Session user type with extended properties
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  roleName: string;
  permissions: string[];
  parish?: string;
  parishName?: string;
}

/**
 * Verify user credentials against database
 * @param email - User email
 * @param password - Plain text password
 * @returns User object if valid, null otherwise
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<SessionUser | null> {
  try {
    await connectToDatabase();

    // Find user with passwordHash (select: false by default)
    const user = await User.findOne({ email, isActive: true })
      .select('+passwordHash')
      .populate<{ role: IRole }>('role')
      .populate<{ parish: IParish | null }>('parish')
      .exec();

    if (!user) {
      return null;
    }

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return null;
    }

    // Construct session user object
    const role = user.role as IRole;
    const parish = user.parish as IParish | null;

    // Convert to plain JS objects (Mongoose arrays can't be serialized to JWT)
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: role._id.toString(),
      roleName: role.name,
      permissions: [...role.permissions], // Convert Mongoose array to plain array
      parish: parish?._id.toString(),
      parishName: parish?.name,
    };
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return null;
  }
}
