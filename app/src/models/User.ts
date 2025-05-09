import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for the User document
export interface IUser extends Document {
  email: string;
  password: string;
  nombre?: string;
  telefono?: string;
  rol: string;
  createdAt: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define schema
const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nombre: String,
  telefono: String,
  rol: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Hash password before saving
userSchema.pre('save', function(next) {
  // Update the updatedAt timestamp
  this.updatedAt = new Date();

  // Only hash password if it's modified
  if (!this.isModified('password')) return next();

  // Hash password with bcrypt
  bcrypt.hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => next(err));
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create model
export const UserModel: Model<IUser> = mongoose.models.User as Model<IUser> ||
  mongoose.model<IUser>('User', userSchema);
