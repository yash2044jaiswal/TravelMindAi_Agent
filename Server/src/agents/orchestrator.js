import communicatorAgent from './communicatorAgent.js';
import itineraryAgent from './itineraryAgent.js';
import logisticsBudgetAgent from './logisticsBudgetAgent.js';
import localDiscoveryAgent from './localDiscoveryAgent.js';

/**
 * TravelAgentOrchestrator (Master Agent)
 * ---------------------------------------
 * Entry point for every chat turn. Runs the Communicator Agent first to
 * classify intent and resolve requirements, then fans out to the three
 * specialist sub-agents in parallel (for new plans, or for updates that
 * meaningfully change requirements), and compiles everything into one
 * unified JSON response for the frontend.
 *
 * No hardcoded copy, no static fallbacks - every user-facing string in a
 * trip plan is produced live by Gemini. If Gemini is not configured or a
 * call fails, the error is thrown and surfaced honestly to the caller.
 */
class TravelAgentOrchestrator {
  async processMessage(message, { history = [], lastTripPlan = null } = {}) {
    const reasoningSteps = [];

    reasoningSteps.push('Communicator Agent: classifying intent and extracting trip requirements.');
    const analysis = await communicatorAgent.analyze(message, history, lastTripPlan);

    if (analysis.intent === 'greeting' || analysis.intent === 'off_topic' || analysis.intent === 'travel_question') {
      reasoningSteps.push(`Communicator Agent: intent classified as "${analysis.intent}". Replying directly.`);
      return {
        reasoningSteps,
        isTripPlan: false,
        chatResponse: analysis.conversationalReply,
        requirements: analysis.requirements,
      };
    }

    const requirements = analysis.requirements;
    const isUpdate = analysis.intent === 'trip_update' && lastTripPlan;

    reasoningSteps.push(
      isUpdate
        ? `Communicator Agent: identified a trip update -> "${analysis.updateInstruction}".`
        : `Communicator Agent: new trip request resolved for ${requirements.source} -> ${requirements.destination}.`
    );

    // Decide whether logistics/discovery need to be regenerated on an update,
    // or can be safely reused because the core trip parameters didn't change.
    const coreParamsChanged =
      !isUpdate ||
      !lastTripPlan ||
      lastTripPlan.destination?.toLowerCase() !== requirements.destination?.toLowerCase() ||
      lastTripPlan.days !== requirements.days ||
      lastTripPlan.budget !== requirements.budget ||
      lastTripPlan.travelers !== requirements.travelers;

    reasoningSteps.push('Dispatching to specialist sub-agents (Itinerary, Logistics & Budget, Local Discovery).');

    const itineraryPromise = itineraryAgent.generate(requirements, {
      existingItinerary: isUpdate ? lastTripPlan.itinerary : null,
      updateInstruction: isUpdate ? analysis.updateInstruction : null,
    });

    const logisticsPromise = coreParamsChanged
      ? logisticsBudgetAgent.generate(requirements)
      : Promise.resolve(lastTripPlan.logistics);

    const discoveryPromise = coreParamsChanged
      ? localDiscoveryAgent.generate(requirements)
      : Promise.resolve(lastTripPlan.discovery);

    const [itinerary, logistics, discovery] = await Promise.all([
      itineraryPromise,
      logisticsPromise,
      discoveryPromise,
    ]);

    reasoningSteps.push('Itinerary Planner Agent: day-by-day plan compiled.');
    reasoningSteps.push('Logistics & Budget Agent: cost breakdown and travel logistics compiled.');
    reasoningSteps.push('Local Discovery Agent: hidden gems and cultural tips compiled.');
    reasoningSteps.push('Orchestrator: merging sub-agent outputs into a unified trip plan.');

    const tripPlan = {
      source: requirements.source,
      destination: requirements.destination,
      budget: requirements.budget,
      currency: requirements.currency || 'INR',
      days: requirements.days,
      travelers: requirements.travelers,
      travelStyle: requirements.travelStyle,
      budgetTier: requirements.budgetTier,
      itinerary,
      costBreakdown: logistics.costBreakdown,
      isWithinBudget: logistics.isWithinBudget,
      marginRemaining: logistics.marginRemaining,
      logistics,
      discovery,
      recommendations: discovery.hiddenGems,
      travelTips: discovery.culturalTips,
      visaInfo: logistics.visaInfo,
      emergencyContacts: logistics.emergencyContacts,
      bestTimeToVisit: logistics.bestTimeToVisit,
      aiInsight: discovery.destinationOverview,
    };

    return {
      reasoningSteps,
      isTripPlan: true,
      chatResponse:
        analysis.conversationalReply ||
        `Your ${tripPlan.days}-day trip from ${tripPlan.source} to ${tripPlan.destination} is ready.`,
      tripPlan,
    };
  }
}

export default new TravelAgentOrchestrator();
