import mongoose, { Schema, Model } from 'mongoose';
import type { IRoleDocument } from '@/types/models.types';
import { UserRole } from '@/types/models.types';

const RoleSchema = new Schema<IRoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(UserRole),
    },
    permissions: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
RoleSchema.index({ name: 1 }, { unique: true });

// Prevent model recompilation in development
const Role: Model<IRoleDocument> =
  mongoose.models.Role || mongoose.model<IRoleDocument>('Role', RoleSchema);

export default Role;
