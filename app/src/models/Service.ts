import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  duration?: number;
  available: boolean;
  image?: {
    data: Buffer;
    contentType: string;
  };
  imageUrl?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    image: {
      data: {
        type: Buffer,
        required: [true, 'Image data is required']
      },
      contentType: {
        type: String,
        required: [true, 'Image content type is required']
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },    
    duration: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
      default: 60
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const ServiceModel =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
