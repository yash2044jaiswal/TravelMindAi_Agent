import geminiConfig from '../config/Gemini.js';
import { logisticsBudgetSchema } from './schemas.js';

/**
 * Logistics & Budget Agent
 * ------------------------
 * Produces realistic cost estimates (flights/trains/local transit/food/stay)
 * and practical travel logistics (safety, best season, visa, emergency info)
 * for the resolved trip requirements.
 */
class LogisticsBudgetAgent {
  async generate(requirements) {
    const { source, destination, days, travelers, budget, currency, budgetTier } = requirements;
    const currentDate = new Date().toLocaleDateString('en-GB');

    const prompt = `
Current date: ${currentDate}
Trip: ${source} -> ${destination}
Duration: ${days} days | Travelers: ${travelers} | Total budget: ${budget} ${currency || 'INR'} | Tier: ${budgetTier}

Produce a realistic, itemized cost breakdown (transport, hotel, food, activities, miscellaneous, total) in ${currency || 'INR'} for ALL travelers combined across the whole trip, calibrated to current real-world pricing for this route and destination and to the requested budget tier.
Also provide:
- 2-4 realistic flight or intercity transport options with rough price ranges
- Train options if relevant to this route (omit list items if not applicable)
- Local transit options at the destination
- 2-3 accommodation suggestions matching the budget tier (by type/area, not fabricated hotel brand names unless well known)
- Practical, destination-specific safety guidelines
- Best season/time to visit and why
- Visa requirements/process if this is international travel from ${source}, otherwise state none required
- A real, correct general emergency contact number for ${destination}
Set isWithinBudget and marginRemaining by comparing your total cost to the stated budget of ${budget}.
`;

    return geminiConfig.generateStructured({
      tier: 'flash',
      systemInstruction:
        'You are the Logistics & Budget Agent inside a multi-agent travel system. You produce grounded, realistic cost ' +
        'estimates and practical logistics using your best real-world knowledge of current prices, transit and safety for ' +
        'the given route and destination. Do not pad numbers arbitrarily - reason about the route distance/mode.',
      prompt,
      responseSchema: logisticsBudgetSchema,
      temperature: 0.5,
    });
  }
}

export default new LogisticsBudgetAgent();
