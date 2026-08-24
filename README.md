# 🌍 TravelMind AI Agent

> Intelligent Multi-Agent Travel Planning Platform powered by AI

TravelMind AI Agent is an AI-powered travel planning platform that helps users generate personalized travel plans using intelligent multi-step reasoning.

Instead of functioning as a traditional chatbot, TravelMind AI Agent acts as a team of AI travel experts that:

* Understand travel requirements
* Analyze budgets
* Recommend transportation
* Select accommodations
* Generate day-wise itineraries
* Provide cost breakdowns
* Suggest alternative travel plans

---

## 🚀 Problem Statement

Planning a trip often requires users to:

* Research destinations
* Compare budgets
* Find accommodations
* Create itineraries
* Estimate expenses

This process is time-consuming and fragmented.

TravelMind AI Agent simplifies travel planning by combining AI reasoning, travel intelligence, and personalized recommendations into a single platform.

---

## ✨ Features

### 🤖 AI Travel Agent

Generate complete travel plans using natural language.

Example:

```text
Plan a 5-day Goa trip from Varanasi under ₹25000
```

---

### 🧠 Multi-Agent Reasoning System

TravelMind simulates multiple AI agents:

#### Agent 1 – Requirement Analyzer

Extracts:

* Source
* Destination
* Budget
* Days
* Travel Type
* Travelers

#### Agent 2 – Budget Planner

Calculates:

* Transportation Cost
* Accommodation Cost
* Food Cost
* Activities Cost

#### Agent 3 – Hotel Selector

Recommends:

* Suitable Hotels
* Budget Friendly Options
* Premium Alternatives

#### Agent 4 – Itinerary Generator

Creates:

* Day-wise Plans
* Attractions
* Activities
* Local Recommendations

#### Agent 5 – Travel Report Generator

Produces:

* Final Travel Summary
* Travel Tips
* Alternative Plans
* Downloadable PDF

---

### 📊 Dashboard

* Saved Trips
* Travel Statistics
* Recent Activity
* Trip History

---

### 💬 AI Chat Interface

Modern conversational interface with:

* Live Reasoning Steps
* Agent Status Tracking
* Chat History
* Travel Recommendations

---

### 📄 PDF Export

Download complete trip reports.

---

### 🔐 Authentication

* User Registration
* Login
* JWT Authentication
* Protected Routes

---

## 🏗️ Architecture

```text
React Frontend
       ↓
Node.js Backend
       ↓
Travel Agent Orchestrator
       ↓
Azure AI Foundry
       ↓
Foundry IQ
       ↓
MongoDB
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion
* React Router
* Axios
* Recharts
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

### AI

* Azure AI Foundry
* Foundry IQ

### Deployment

* Vercel
* Render
* MongoDB Atlas

---

## 📁 Project Structure

```text
TravelMind-AI/
│
├── frontend/
│
├── backend/
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd TravelMind-AI
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

JWT_EXPIRE=7d

GEMINI_API_KEY=
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run Frontend

```bash
npm run dev
```

---

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Chat

```http
POST /api/chat
GET  /api/chat/history
```

### Trips

```http
POST   /api/trips
GET    /api/trips
GET    /api/trips/:id
DELETE /api/trips/:id
```

### PDF

```http
GET /api/trips/:id/pdf
```

---

## 🎯 Hackathon Highlights

* Multi-Agent Architecture
* AI-Powered Travel Planning
* Real-Time Reasoning Visualization
* Foundry IQ Knowledge Retrieval
* Modern SaaS User Experience
* Full-Stack MERN Application

---

## 🔮 Future Improvements

* Flight API Integration
* Hotel Booking Integration
* Maps & Navigation
* Voice Assistant
* Group Travel Planning
* Travel Collaboration

---

## 👨‍💻 Developer

Yash Jaiswal

Built for the Microsoft Agents League Hackathon 2026.

---

## 📄 License

MIT License
