// models/Reservation.ts
import { Schema, model, models, Document, Types } from 'mongoose';

interface Reservation extends Document {
  userId: string;
  service: Types.ObjectId | string;
  date: Date;
}

const ReservationSchema = new Schema<Reservation>({
  userId: { type: String, required: true },
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true
});

export const ReservationModel = models.Reservation || model<Reservation>('Reservation', ReservationSchema);