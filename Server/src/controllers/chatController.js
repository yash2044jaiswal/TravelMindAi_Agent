import Chat from '../models/Chat.js';
import orchestrator from '../agents/orchestrator.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Controller wiring the Communicator & Orchestrator Agent into HTTP.
 * Fully generative - no hardcoded intent detection or mock data anywhere.
 * Chat history is persisted per-user in MongoDB and replayed as context on
 * every turn so the orchestrator can support dynamic updates
 * (e.g. "change Day 2 to adventure sports").
 */
class ChatController {
  // POST /api/chat
  handleChatMessage = async (req, res, next) => {
    try {
      const { message } = req.body;

      if (!message || message.trim().length === 0) {
        return next(new ApiError(400, 'Message is required'));
      }

      // Pull recent conversation context for this user so the orchestrator
      // can resolve pronouns, omitted fields, and "update my last plan" requests.
      const recentTurns = await Chat.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();
      const orderedTurns = recentTurns.reverse();

      const history = orderedTurns.flatMap(turn => ([
        { role: 'user', content: turn.prompt },
        { role: 'assistant', content: turn.chatResponse || '(trip plan generated)' },
      ]));

      const lastTripTurn = [...orderedTurns].reverse().find(t => t.isTripPlan && t.responsePlan);
      const lastTripPlan = lastTripTurn ? lastTripTurn.responsePlan : null;

      const result = await orchestrator.processMessage(message, { history, lastTripPlan });

      // Persist this turn for future context and dashboard/history use.
      await Chat.create({
        user: req.user._id,
        prompt: message,
        reasoningSteps: result.reasoningSteps,
        role: 'user',
        isTripPlan: result.isTripPlan,
        chatResponse: result.chatResponse,
        responsePlan: result.isTripPlan ? result.tripPlan : undefined,
      });

      return res.status(200).json(
        new ApiResponse(200, {
          reasoningSteps: result.reasoningSteps,
          chatResponse: result.chatResponse,
          isTripPlan: result.isTripPlan,
          tripPlan: result.isTripPlan ? result.tripPlan : undefined,
        }, 'AI Agent response generated successfully.')
      );
    } catch (err) {
      next(new ApiError(502, `Travel Agent System failed to process your request: ${err.message}`));
    }
  };

  // GET /api/chat/history
  getChatHistory = async (req, res, next) => {
    try {
      const history = await Chat.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
      return res.status(200).json(
        new ApiResponse(200, history.reverse(), 'Chat history retrieved.')
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new ChatController();
