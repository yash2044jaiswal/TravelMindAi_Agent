import geminiConfig from '../config/Gemini.js';
import { itinerarySchema } from './schemas.js';

/**
 * Itinerary Planner Agent
 * -----------------------
 * Dynamically builds a logical day-by-day itinerary for the resolved trip
 * requirements. Supports incremental updates against a prior itinerary
 * ("change Day 2 to adventure sports") by receiving the previous itinerary
 * and a natural-language update instruction, and returning a full itinerary
 * with only the relevant days changed.
 */
class ItineraryAgent {
  async generate(requirements, { existingItinerary = null, updateInstruction = null } = {}) {
    const { source, destination, days, travelers, budget, budgetTier, travelStyle, language } = requirements;

    const updateBlock = existingItinerary
      ? `
This is an UPDATE to an existing itinerary, not a fresh plan. Existing itinerary (JSON):
${JSON.stringify(existingItinerary)}

Update instruction from the user: "${updateInstruction}"
Apply the instruction precisely. Keep every other day consistent with the existing itinerary unless the instruction implies a broader change (e.g. changed trip length). Return the COMPLETE itinerary for all ${days} days, not just the changed day.
`
      : `Build a brand new, complete ${days}-day itinerary from scratch.`;

    const prompt = `
Trip: ${source} -> ${destination}
Duration: ${days} days | Travelers: ${travelers} | Budget: ${budget} | Budget tier: ${budgetTier} | Style: ${travelStyle || 'general sightseeing'}
Respond in: ${language || 'English'}

${updateBlock}

Guidelines:
- Day 1 should account for arrival/travel time; the final day should account for departure logistics.
- Balance pacing: mix iconic sights, local experiences, and rest/travel time appropriate to the travel style.
- Use real, specific place names and neighborhoods for ${destination} wherever you have reliable knowledge; avoid vague placeholders like "Local Market".
- estimatedDayCost should be a realistic per-day total (in the trip's local budget currency) covering food, local transit, and activities for that day for all travelers combined.
- Keep tone practical and specific, not generic filler text.
`;

    const result = await geminiConfig.generateStructured({
      tier: 'pro',
      systemInstruction:
        'You are the Itinerary Planner Agent inside a multi-agent travel system. You produce logical, realistic, ' +
        'day-by-day travel itineraries tailored to destination, duration, budget tier and travel style. You never invent ' +
        'placeholder attractions when real ones are knowable.',
      prompt,
      responseSchema: itinerarySchema,
      temperature: 0.7,
    });

    return result.itinerary;
  }
}

export default new ItineraryAgent();
