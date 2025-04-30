import mongoose from 'mongoose';

const deliveryPersonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
  status: {
    type: String,
    enum: ['free', 'busy', 'unavailable'],
    default: 'free',
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5,
  },
}, {
  timestamps: true,
});

export const DeliveryPerson = mongoose.model('DeliveryPerson', deliveryPersonSchema);
