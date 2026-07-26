# ShipFlowX: Enterprise Logistics Management Platform

ShipFlowX is a modern, premium dark-themed logistics coordination and live shipment tracking portal designed for enterprise freight networks.

## Technology Stack

- **Frontend**: React, Vite, React Router, Tailwind CSS, Axios, Framer Motion
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose

## Core Modules & Features

- **Module 1: Landing Page**: High-performance dashboard entry point featuring responsive hero sections, tariff estimators, and dispatch grids.
- **Module 2: Authentication**: Token-based JSON Web Token (JWT) credentials matching, role validations, and secure Google SSO integrations.
- **Module 3: Customer Dashboard**: Active cargo shipment listings, freight payment indicators, and total cost summaries.
- **Module 4 & 5: Booking & Tracking**: 5-step interactive wizard booking flow coupled with real-time waypoint timelines.
- **Module 6: Admin Operations**: Access-restricted controls to update freight checkpoints, location nodes, and consignee status.
- **Module 7 & 8: Rates & Schedules**: Dimensional weight rate calculators and ocean/air freight timetable schedules.
- **AI Shipping Assistant [NEW]**: Intelligent conversational logistics copilot. Powered by structured logic mappings, ready for future OpenAI/Gemini API key bindings. Supports interactive suggestion prompts, loading indicators, and local session caches.

## Project Directory Layout

```text
ShipFlowX/
├── backend/            # Node/Express REST API
├── frontend/           # React client application (Vite-powered)
├── docker-compose.yml  # Docker environment orchestration
├── .gitignore          # Version control ignore lists
└── README.md           # This project guide
```

## Running the Application Locally

### Using Docker Compose (Recommended)

To run the entire network (database, API server, and web client) automatically:

1. Ensure Docker Desktop is active on your machine.
2. In the project root folder, execute:
   ```bash
   docker-compose up --build
   ```
3. Once running, access the services:
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000`
   - **MongoDB Instance**: `mongodb://localhost:27017`

### Running Manually

If you prefer to run services individually without Docker:

#### 1. Database
Make sure you have MongoDB running locally at `mongodb://localhost:27017/shipflowx`.

#### 2. Start Backend API
```bash
cd backend
npm install
npm run dev
```

#### 3. Start Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.
