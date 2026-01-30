import mongoose, { Schema, Model } from 'mongoose';
import type { IParishDocument } from '@/types/models.types';

const ParishSchema = new Schema<IParishDocument>(
  {
    name: {
      type: String,
      required: [true, 'Parish name is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    foundingDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ParishSchema.index({ name: 1 });
ParishSchema.index({ isActive: 1 });

// Prevent model recompilation in development
const Parish: Model<IParishDocument> =
  mongoose.models.Parish || mongoose.model<IParishDocument>('Parish', ParishSchema);

export default Parish;
