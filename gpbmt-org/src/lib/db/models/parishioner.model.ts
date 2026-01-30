import mongoose, { Schema, Model } from 'mongoose';
import type { IParishionerDocument } from '@/types/models.types';
import { Gender } from '@/types/models.types';

const ParishionerSchema = new Schema<IParishionerDocument>(
  {
    parish: {
      type: Schema.Types.ObjectId,
      ref: 'Parish',
      required: [true, 'Parish is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    baptismName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    familyHead: {
      type: Schema.Types.ObjectId,
      ref: 'Parishioner',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ParishionerSchema.index({ parish: 1 });
ParishionerSchema.index({ fullName: 1 });
ParishionerSchema.index({ parish: 1, fullName: 1 });
ParishionerSchema.index({ familyHead: 1 });

// Prevent model recompilation in development
const Parishioner: Model<IParishionerDocument> =
  mongoose.models.Parishioner || mongoose.model<IParishionerDocument>('Parishioner', ParishionerSchema);

export default Parishioner;
