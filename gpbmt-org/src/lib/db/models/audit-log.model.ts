import mongoose, { Schema, Model } from 'mongoose';
import type { IAuditLogDocument } from '@/types/models.types';
import { AuditAction } from '@/types/models.types';

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: [true, 'Action is required'],
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      trim: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Entity ID is required'],
    },
    oldValue: {
      type: Schema.Types.Mixed,
    },
    newValue: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
AuditLogSchema.index({ user: 1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1 });

// Prevent model recompilation in development
const AuditLog: Model<IAuditLogDocument> =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);

export default AuditLog;
