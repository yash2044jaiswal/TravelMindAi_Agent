import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: [true, 'User request/prompt is required'],
    trim: true
  },
  reasoningSteps: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    default: 'user'
  },
  isTripPlan: {
    type: Boolean,
    default: false
  },
  chatResponse: {
    type: String
  },
  // Full compiled tripPlan JSON from the orchestrator (all agent outputs merged).
  // Kept as Mixed since agent schemas are AI-generated and may legitimately vary in field richness.
  responsePlan: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

chatSchema.index({ user: 1, createdAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;