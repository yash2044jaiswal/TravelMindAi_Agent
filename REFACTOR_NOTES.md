# TravelMind AI — Multi-Agent Refactor Notes & Setup Guide

## 1. Structure Audit — where mock/hardcoded data lived

| Location | Problem | Fix |
|---|---|---|
| `Server/src/services/travelAgent.js` | `_generateHighFidelityLocalContext()` fabricated attractions, costs, tips whenever Gemini wasn't configured or failed — a silent mock fallback | Deleted. Replaced by `agents/logisticsBudgetAgent.js` + `agents/localDiscoveryAgent.js`, no fallback |
| `Server/src/services/ItineraryGeneratorService.js` | Static day-1/day-N/middle-day templates ("Local Bazaar", "Scenic Viewpoint") | Deleted. Replaced by `agents/itineraryAgent.js` |
| `Server/src/services/budgetPlannerServices.js` | Fixed percentage splits (45/35/20) and fixed per-person transport tiers | Deleted. Replaced by `agents/logisticsBudgetAgent.js` |
| `Server/src/services/TravelAgentOrchestrator.js` | Regex/fuzzy-match requirement parser (`_extractRequirementsRobustRegex`) used whenever the Gemini key was missing; only 5 hardcoded destinations recognized | Deleted. Replaced by `agents/orchestrator.js` + `agents/communicatorAgent.js` |
| `Server/src/controllers/chatController.js` | Hardcoded keyword lists (`isGreeting`, `isTravelRelated`) and hand-written greeting/off-topic response text | Rewritten — intent classification and reply text are both produced live by the Communicator Agent |
| `Server/src/config/Gemini.js` | Used the older `@google/generative-ai` SDK, model pinned to `gemini-1.5-flash` | Rewritten on the official `@google/genai` SDK with `gemini-2.5-flash` / `gemini-2.5-pro` and `responseSchema` structured output |
| `Client/src/App.jsx` | ~1,700 lines of dead/commented mock `ApiService` using `localStorage` (`mock_trips`, `mock_jwt_token_*`) | Stripped out — the app already only uses the real `Services/*` + Express API |
| `Client/src/components/dashboard/ActivityFeed.jsx` | Hardcoded 3-item fake activity feed | Rewritten to render the user's real recent trips |
| `Client/src/pages/Dashboard.jsx` | Fabricated 6-month chart (all zeros except current month) and fake `+12%/+8%/+25%/+5%` change badges, fake "94/100" trip score | Rewritten to consume a real `monthlyTrend` + `avgBudgetUtilization` from the backend, with honest month-over-month deltas |
| `Server/src/controllers/userController.js` | (supporting fix) `getDashboardStats` only returned totals | Extended with a real MongoDB aggregation for `monthlyTrend` and `avgBudgetUtilization` |

Auth, User, Trip controllers/models and the rest of the client (`TripCard`, `BudgetBreakdown`, `TripTimeline`, `CompareTrips`, services) were already DB/API-driven with no mock data and needed no changes.

## 2. New Agent Architecture (`Server/src/agents/`)

```
Communicator Agent (agents/communicatorAgent.js)
   │  classifies intent + extracts/resolves requirements (gemini-2.5-flash)
   ▼
Orchestrator (agents/orchestrator.js)
   │  fans out in parallel:
   ├── Itinerary Planner Agent      (agents/itineraryAgent.js)      gemini-2.5-pro
   ├── Logistics & Budget Agent     (agents/logisticsBudgetAgent.js) gemini-2.5-flash
   └── Local Discovery Agent        (agents/localDiscoveryAgent.js)  gemini-2.5-flash
   │  merges into one tripPlan JSON
   ▼
chatController → ApiResponse → Client
```

- **Structured output**: every agent call passes a `responseSchema` (see `agents/schemas.js`) via `responseMimeType: 'application/json'`, so outputs are guaranteed-shape JSON, not free text needing parsing.
- **Chat history / dynamic updates**: `chatController` loads the caller's last 6 turns and their last saved trip plan from MongoDB (`Chat` model) and passes them into the orchestrator as context. If the Communicator Agent classifies a message as `trip_update` (e.g. *"change Day 2 to adventure sports"*), the Itinerary Agent receives the prior itinerary + a natural-language update instruction and returns a full itinerary with just the relevant day(s) changed; Logistics/Discovery are only re-run if core params (destination/days/budget/travelers) actually changed, saving calls.
- **No offline fallback**: if `GEMINI_API_KEY` is missing or a call fails, the error propagates as a real `502` — the system never silently substitutes fabricated data.

## 3. Setup Instructions

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- A Gemini API key from https://aistudio.google.com/apikey

### Backend
```bash
cd Server
npm install          # already includes @google/genai
cp ../.env.example .env   # or edit the existing Server/.env
```
Edit `Server/.env`:
```
MONGODB_URI=<your mongo connection string>
JWT_SECRET=<any long random string>
GEMINI_API_KEY=<your real Gemini API key>
GEMINI_FLASH_MODEL=gemini-2.5-flash   # optional override
GEMINI_PRO_MODEL=gemini-2.5-pro       # optional override
CLIENT_URL=http://localhost:5173
```
Run it:
```bash
node server.js
# -> TravelMind AI Backend Agent Server running on port 5000
```

### Frontend
```bash
cd Client
npm install
```
`Client/.env` already points at the local API:
```
VITE_API_URL=http://localhost:5000/api
```
Run it:
```bash
npm run dev
# -> http://localhost:5173
```

### Smoke test
1. Register/login in the app.
2. Open the Planner and send: *"Plan a 5 day trip to Kyoto from Delhi for 2 people, budget 150000 INR, adventure style"*.
3. You should see live reasoning steps stream, then a full itinerary/budget/discovery card — all Gemini-generated, nothing templated.
4. Follow up with: *"Change Day 2 to adventure sports"* — the Itinerary Agent should update just that day while keeping the rest of the trip intact.
