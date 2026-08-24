import { Type } from '@google/genai';

/**
 * Structured Output schemas shared across the agent system.
 * Using `responseSchema` (JSON mode) guarantees the shape of every
 * agent's output so it can be composed by the Orchestrator and passed
 * straight to the client without further sanitation.
 */

// --- Communicator & Orchestrator (intent + requirement extraction) ---
export const communicatorSchema = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      enum: ['greeting', 'off_topic', 'trip_request', 'trip_update', 'travel_question'],
      description: 'Classification of the user message.',
    },
    conversationalReply: {
      type: Type.STRING,
      description:
        'A natural, in-character reply to show the user directly. Required for greeting, off_topic and travel_question intents. Empty string for trip_request/trip_update.',
    },
    updateInstruction: {
      type: Type.STRING,
      description:
        'For trip_update only: a concise natural-language instruction describing exactly what should change (e.g. "Make Day 2 an adventure sports day"). Empty string otherwise.',
    },
    requirements: {
      type: Type.OBJECT,
      description: 'Trip parameters, resolved using conversation history where the user omitted them.',
      properties: {
        source: { type: Type.STRING },
        destination: { type: Type.STRING },
        budget: { type: Type.NUMBER },
        currency: { type: Type.STRING, description: 'ISO currency code, default INR' },
        days: { type: Type.INTEGER },
        travelers: { type: Type.INTEGER },
        travelStyle: {
          type: Type.STRING,
          description: 'e.g. relaxed, adventure, cultural, luxury, backpacking, family, romantic',
        },
        budgetTier: { type: Type.STRING, enum: ['budget', 'moderate', 'luxury'] },
        language: { type: Type.STRING, description: 'Language the user is communicating in.' },
      },
      required: ['source', 'destination', 'budget', 'days', 'travelers', 'budgetTier', 'language'],
    },
  },
  required: ['intent', 'conversationalReply', 'updateInstruction', 'requirements'],
};

// --- Itinerary Planner Agent ---
export const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          theme: { type: Type.STRING, description: 'Short theme, e.g. "Adventure sports day"' },
          activities: { type: Type.ARRAY, items: { type: Type.STRING } },
          meals: {
            type: Type.OBJECT,
            properties: {
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              dinner: { type: Type.STRING },
            },
            required: ['breakfast', 'lunch', 'dinner'],
          },
          accommodation: { type: Type.STRING },
          travelDetails: { type: Type.STRING },
          estimatedDayCost: { type: Type.NUMBER },
          tips: { type: Type.STRING },
        },
        required: ['day', 'title', 'activities', 'meals', 'accommodation', 'travelDetails', 'estimatedDayCost', 'tips'],
      },
    },
  },
  required: ['itinerary'],
};

// --- Logistics & Budget Agent ---
export const logisticsBudgetSchema = {
  type: Type.OBJECT,
  properties: {
    costBreakdown: {
      type: Type.OBJECT,
      properties: {
        transport: { type: Type.NUMBER },
        hotel: { type: Type.NUMBER },
        food: { type: Type.NUMBER },
        activities: { type: Type.NUMBER },
        miscellaneous: { type: Type.NUMBER },
        total: { type: Type.NUMBER },
      },
      required: ['transport', 'hotel', 'food', 'activities', 'miscellaneous', 'total'],
    },
    isWithinBudget: { type: Type.BOOLEAN },
    marginRemaining: { type: Type.NUMBER },
    flightOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
    trainOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
    localTransitOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
    accommodationSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    safetyGuidelines: { type: Type.ARRAY, items: { type: Type.STRING } },
    bestTimeToVisit: { type: Type.STRING },
    visaInfo: { type: Type.STRING },
    emergencyContacts: { type: Type.STRING },
  },
  required: [
    'costBreakdown', 'isWithinBudget', 'marginRemaining', 'flightOptions', 'trainOptions',
    'localTransitOptions', 'accommodationSuggestions', 'safetyGuidelines', 'bestTimeToVisit',
    'visaInfo', 'emergencyContacts',
  ],
};

// --- Local Discovery Agent ---
export const localDiscoverySchema = {
  type: Type.OBJECT,
  properties: {
    hiddenGems: { type: Type.ARRAY, items: { type: Type.STRING } },
    culinarySpots: { type: Type.ARRAY, items: { type: Type.STRING } },
    mustTryDishes: { type: Type.ARRAY, items: { type: Type.STRING } },
    culturalTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    seasonalHighlights: { type: Type.STRING },
    destinationOverview: { type: Type.STRING },
  },
  required: ['hiddenGems', 'culinarySpots', 'mustTryDishes', 'culturalTips', 'seasonalHighlights', 'destinationOverview'],
};
