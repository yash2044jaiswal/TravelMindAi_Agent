import geminiConfig from '../config/Gemini.js';
import { communicatorSchema } from './schemas.js';

/**
 * Communicator Agent
 * ------------------
 * The primary entry point for every user message. It is responsible for:
 *  - Classifying user intent (greeting / off-topic / new trip / trip update / travel question)
 *  - Extracting structured trip requirements, resolving anything the user
 *    omitted using the conversation history (e.g. "make it 7 days instead")
 *  - Producing the natural-language reply for non-planning intents
 *
 * This entirely replaces the old regex/keyword based greeting & travel
 * detection - the classification itself is Gemini-driven.
 */
class CommunicatorAgent {
  async analyze(message, history = [], lastTripPlan = null) {
    const historyText = this._formatHistory(history);
    const lastPlanText = lastTripPlan
      ? `\nMost recent trip plan on record (for context / possible updates):\n${JSON.stringify(lastTripPlan)}\n`
      : '\nNo prior trip plan exists in this conversation.\n';

    const prompt = `
Conversation history (oldest first):
${historyText || '(no prior turns)'}
${lastPlanText}
Latest user message: "${message}"

Classify this message and extract/resolve trip requirements.
Rules:
- "greeting": small talk / hello / thanks with no travel ask.
- "off_topic": unrelated to travel entirely.
- "travel_question": a general travel question that is not asking for a full new itinerary (e.g. "what's the best time to visit Japan?").
- "trip_request": user wants a new or first full trip plan. Fill in any missing fields with sensible defaults only when truly unspecified, but prefer asking nothing - use context clues.
- "trip_update": user is asking to modify an existing plan already on record (e.g. "change Day 2 to adventure sports", "make it cheaper", "add 2 more days"). Carry forward all unchanged requirement fields from the last trip plan.
- Correct obvious spelling mistakes in place names.
- Always resolve currency to a 3-letter ISO code (assume INR if unclear and source/destination are in India).
- Detect the language the user is writing in and respond in that language for conversationalReply.
`;

    return geminiConfig.generateStructured({
      tier: 'flash',
      systemInstruction:
        'You are the Communicator & Orchestrator Agent of a multi-agent travel planning system called TravelMind AI. ' +
        'You are warm, concise, and only ever discuss travel planning. You never fabricate a conversationalReply for trip_request or trip_update intents - leave it empty, another agent will compile the final response.',
      prompt,
      responseSchema: communicatorSchema,
      temperature: 0.4,
    });
  }

  _formatHistory(history) {
    return history
      .slice(-8)
      .map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
      .join('\n');
  }
}

export default new CommunicatorAgent();
