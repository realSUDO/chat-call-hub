# Chat Call Hub

A modern chat and feed application with voice call capabilities.

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express (Backend)

## Setup

### Frontend

Install dependencies:
```sh
npm i
```

Start development server:
```sh
npm run dev
```

### Backend

Install dependencies:
```sh
cd backend
npm i
```

Start backend server:
```sh
npm run dev
```

Backend runs on `http://localhost:3001`

## Features

- Chat interface connected to backend API
- Feed with relevance-based content
- Voice call functionality
- Modern dark UI

## Architecture

- Frontend: React app on Vite dev server (default: port 5173)
- Backend: Express server with /chat endpoint (port 3001)
- Chat messages are sent to POST /chat endpoint
- Ready for RAG pipeline and LLM integration
