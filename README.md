# 🌍 TravelMind AI

**An AI travel planning platform powered by an orchestrated multi-prompt Gemini pipeline**

TravelMind AI helps users generate personalized, structured travel plans through natural language conversation. Instead of a single monolithic prompt, it splits the planning task across specialized, purpose-built prompt modules — a Communicator, an Itinerary Planner, a Logistics & Budget module, and a Local Discovery module — orchestrated by a Node.js backend and powered by Google's Gemini API.

> **A note on terminology:** this project is architected as a **multi-role, multi-prompt orchestration pipeline**, not an autonomous multi-agent system in the strict technical sense (no independent agent decision-making, no agent-to-agent negotiation, no self-correction loops — yet). Each "module" below is a specialized Gemini call with its own system prompt and JSON output schema, coordinated by deterministic backend code. Turning this into a genuinely agentic system (planner/router agent, tool-calling, self-critique loops) is a planned next step — see [Roadmap](#-roadmap).

---

## 🚀 Problem Statement

Planning a trip usually means juggling multiple separate tasks: researching a destination, comparing budgets, finding places to stay, building a day-by-day plan, and estimating costs — all scattered across different tools and tabs.

TravelMind AI collapses this into a single conversational interface: describe the trip in plain language, and get back a complete, structured plan with itinerary, costs, logistics, and local recommendations.

---

## ✨ Features

### 🤖 Conversational Trip Planning
Describe a trip in natural language and get a structured plan back.

```
Plan a 5-day Goa trip from Delhi under ₹25,000 for 2 people
```

Follow-up edits are also understood in context, e.g.:

```
Change Day 2 to adventure sports instead
```

### 🧩 Multi-Prompt Orchestration Pipeline

Every chat message flows through a pipeline of specialized Gemini calls (`Server/src/agents/`):

**1. Communicator (Master Entry Point)** — `communicatorAgent.js`
Classifies the message intent (greeting / off-topic / travel question / new trip request / update to an existing trip) and extracts structured trip requirements (source, destination, budget, duration, travelers, travel style), resolving anything left unstated using conversation history.

**2. Itinerary Planner** — `itineraryAgent.js`
Builds a realistic, logical day-by-day itinerary for the resolved requirements. On an update request, it receives the previous itinerary plus a natural-language change instruction and returns a revised full itinerary.

**3. Logistics & Budget** — `logisticsBudgetAgent.js`
Produces a cost breakdown (transport, hotel, food, activities, misc), transport options, accommodation suggestions, safety guidelines, best time to visit, and visa information.

**4. Local Discovery** — `localDiscoveryAgent.js`
Surfaces hidden gems, culinary spots, must-try dishes, cultural etiquette tips, and seasonal highlights for the destination.

The **Orchestrator** (`orchestrator.js`) runs the Itinerary, Logistics & Budget, and Local Discovery calls **in parallel** (`Promise.all`) once requirements are resolved, then merges their structured JSON outputs into one unified trip plan for the frontend. All outputs use Gemini's `responseSchema` (JSON mode) — there is no regex parsing or hardcoded fallback data anywhere in the pipeline.

### 📊 Dashboard
- Real trip statistics computed from saved trips (total trips, total spend, chat sessions, average budget utilization)
- A real 6-month trip/spend trend, aggregated from MongoDB
- Recent activity feed built from actual saved trips

### 💬 Chat Interface
- Live reasoning-step trace showing which pipeline stage is running
- Persistent chat history (used as context for follow-up edits)
- Structured trip plan cards rendered from the merged JSON

### 📄 PDF Export
Download a generated trip plan as a PDF report.

### 🔐 Authentication
- Registration / login with JWT
- Protected API routes

---

## 🏗️ Architecture

```
React Frontend (Client/)
        │  Axios
        ▼
Express Backend (Server/)
        │
        ▼
chatController → Orchestrator (agents/orchestrator.js)
        │
        ├── Communicator Agent ───────────► Gemini API (flash tier)
        │        │
        │        ▼ (resolved requirements)
        ├── Itinerary Planner Agent ──────► Gemini API (pro/flash tier)   ┐
        ├── Logistics & Budget Agent ─────► Gemini API (flash tier)      ├─ run in parallel
        └── Local Discovery Agent ────────► Gemini API (flash tier)      ┘
        │
        ▼
   merged tripPlan JSON
        │
        ▼
     MongoDB (chat history + saved trips)
```

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios
- Recharts
- React Hot Toast

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication, bcryptjs

**AI**
- Google Gemini API via the official `@google/genai` SDK
- Structured Output / JSON mode (`responseSchema`) for every agent call
- Configurable model tiers: a fast/cheap model for classification, logistics, and discovery, and a higher-quality model for itinerary generation

**Deployment (suggested)**
- Vercel / Render for hosting
- MongoDB Atlas for the database

---

## 📁 Project Structure

```
MSProject/
│
├── Client/               # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── Services/      # API service layer
│       └── context/
│
├── Server/                # Node.js/Express backend
│   └── src/
│       ├── agents/         # Communicator, Itinerary, Logistics & Budget, Local Discovery + schemas
│       ├── config/          # DB + Gemini client config
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── services/        # PDF generation, etc.
│
├── REFACTOR_NOTES.md       # Details on the Gemini-powered rebuild
└── README.md
```

---

## ⚙️ Installation

### Clone the repository
```bash
git clone <repository-url>
cd MSProject
```

### Backend setup
```bash
cd Server
npm install
```

Create `Server/.env`:
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/travelmind
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Get a key at https://aistudio.google.com/apikey
GEMINI_API_KEY=
GEMINI_FLASH_MODEL=gemini-2.5-flash
GEMINI_PRO_MODEL=gemini-2.5-flash

CLIENT_URL=http://localhost:5173
```

> **Free-tier note:** as of 2026, Gemini's Pro-tier models are no longer available on the free API tier for new projects (only Flash-tier models are). Using `gemini-2.5-flash` (or the current flash model) for both `GEMINI_FLASH_MODEL` and `GEMINI_PRO_MODEL` keeps the whole pipeline on the free tier. Check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) for current model availability — model names are configurable via `.env`, no code changes needed.

Run the backend:
```bash
npm run dev
# or: node server.js
```

### Frontend setup
```bash
cd Client
npm install
```

Create `Client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

---

## 📡 API Endpoints

**Authentication**
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
```

**Chat (orchestration pipeline)**
```
POST /api/chat            # send a message, get back a chat reply or a full trip plan
GET  /api/chat/history     # retrieve recent chat turns
```

**Trips**
```
POST   /api/trips
GET    /api/trips
GET    /api/trips/:id
DELETE /api/trips/:id
GET    /api/trips/:id/pdf   # export a trip as PDF
```

**Dashboard**
```
GET /api/users/dashboard
```

---

## 🎯 Project Highlights

- Multi-role, multi-prompt Gemini orchestration with parallel execution
- Structured Output (JSON schema) on every AI call — no regex parsing, no hardcoded fallback data
- Context-aware follow-up edits (e.g. "change Day 2") using persisted chat history
- Full-stack MERN application with real, database-backed dashboard analytics
- PDF export and JWT-protected routes

---

## 🔮 Roadmap

**Toward genuine multi-agent behavior**
- [ ] A router/planner module that dynamically decides which sub-modules to invoke, instead of a fixed sequence
- [ ] Function-calling / tool use (e.g. live flight or weather lookups) that a module can invoke autonomously
- [ ] A self-critique loop (e.g. a budget-check pass that sends the itinerary back for revision if it exceeds budget)

**Product features**
- [ ] Flight and hotel booking API integration
- [ ] Maps & navigation
- [ ] Voice assistant
- [ ] Group travel planning / collaboration

---

## 👨‍💻 Developer

**Yash Kumar Jaiswal**

---

## 📄 License

MIT License
