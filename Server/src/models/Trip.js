import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    required: [true, 'Source destination or starting city is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Target destination is required'],
    trim: true
  },
  budget: {
    type: Number,
    required: [true, 'Overall budget cap is required']
  },
  days: {
    type: Number,
    required: [true, 'Trip duration in days is required'],
    min: [1, 'Trip must be at least 1 day long']
  },
  travelers: {
    type: Number,
    default: 1,
    min: [1, 'Must have at least 1 traveler']
  },
  itinerary: {
    type: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        activities: [{ type: String }],
        meals: {
          breakfast: String,
          lunch: String,
          dinner: String
        },
        accommodation: String,
        travelDetails: String,
        tips: String
      }
    ],
    required: true
  },
  recommendations: {
    type: [String],
    default: []
  },
  totalCost: {
    transport: { type: Number, default: 0 },
    hotel: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Set indexed search fields for quick travel dashboard retrieval
tripSchema.index({ user: 1, createdAt: -1 });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;