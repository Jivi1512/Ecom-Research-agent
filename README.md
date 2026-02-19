
# E-Commerce Autonomous Research Agent (v2)

This project is a multi-step autonomous research agent built for e-commerce SKU intelligence.

## 🚀 Key Features
- **Autonomous Planning**: The agent analyzes your query and builds a custom multi-step JSON execution plan.
- **Tool-Based Execution**: Runs individual tasks (retrieval, sentiment, price math, topic clustering) through a structured executor.
- **Mock-First Architecture**: Operates fully with embedded datasets in `mocks/dataset.ts` for instant preview (no file uploads needed).
- **Human-in-the-Loop**: Supports `ASK_USER` steps where the agent pauses for clarification before resuming.
- **Deep Synthesis**: Uses Gemini 3 Pro with Thinking Budget for final report generation based on execution traces.
- **Provenance**: Every finding is grounded in a verifiable trace of tool outputs and mock records.

## 🛠 Tech Stack
- **Frontend**: React 18, Tailwind CSS, Lucide Icons.
- **Brain**: Google Gemini API (@google/genai).
- **Orchestration**: Custom Planner/Executor pattern with JSON Schema validation.

## 🏃 Local Development
1. `npm install`
2. Set `API_KEY=...` in your environment.
3. `npm run dev`

## 📊 Deployment
The app is designed for **Render**. It serves a single static build that communicates directly with the Gemini API via client-side requests (using injected env keys).

## 🧪 Testing the Agent
1. **Mock Test**: Type `SKU-7788`, select **Deep**, and click **Generate Plan**. Observe the step-by-step logs in the console.
2. **Clarification Flow**: If the planner detects ambiguity, it will insert a "Paused" step asking for clarification.
3. **Trace View**: After completion, the report includes a full trace of how each finding was computed.
