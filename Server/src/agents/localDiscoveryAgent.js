import geminiConfig from '../config/Gemini.js';
import { localDiscoverySchema } from './schemas.js';

/**
 * Local Discovery Agent
 * ---------------------
 * Surfaces authentic hidden gems, culinary spots, cultural tips and
 * seasonal highlights for the destination - the "insider knowledge" layer
 * of the trip plan.
 */
class LocalDiscoveryAgent {
  async generate(requirements) {
    const { destination, source, travelStyle, language } = requirements;
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const prompt = `
Destination: ${destination} (traveler arriving from ${source})
Travel style: ${travelStyle || 'general sightseeing'}
Current month: ${currentMonth}
Respond in: ${language || 'English'}

Provide:
- 3-5 authentic hidden gems / off-the-beaten-path spots (not the top mainstream tourist attractions)
- 3-5 culinary spots (specific local eateries, markets, or food streets where possible)
- 3-5 must-try local dishes
- 3-5 practical cultural tips (etiquette, customs, tipping norms, dress code, common scams to avoid)
- A short note on seasonal highlights for visiting in ${currentMonth} specifically
- A 2-3 sentence destination overview capturing its character
`;

    return geminiConfig.generateStructured({
      tier: 'flash',
      systemInstruction:
        'You are the Local Discovery Agent inside a multi-agent travel system. You surface authentic, specific, ' +
        'insider-level local knowledge rather than generic tourist-brochure content. Prefer specific named places over vague categories.',
      prompt,
      responseSchema: localDiscoverySchema,
      temperature: 0.8,
    });
  }
}

export default new LocalDiscoveryAgent();
