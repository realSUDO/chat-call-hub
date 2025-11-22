# Chat Call Hub Backend

Express server with RAG pipeline for Indian Constitution queries.

## Setup

### 1. Install Node dependencies
```sh
npm install
```

### 2. Install Python dependencies
```sh
pip install -r requirements.txt
```

### 3. Set environment variable
```sh
export GEMINI_API_KEY="your_gemini_api_key"
```

### 4. Ensure vector DB exists
Make sure `~/db/faiss.index` and `~/db/chunks.json` exist.

## Run

```sh
npm run dev
```

Server runs on `http://localhost:3001`

## Architecture

**RAG Pipeline:**
1. User sends message to `/chat`
2. Node.js spawns Python `rag_service.py`
3. Python searches FAISS vector DB using Legal-BERT
4. Retrieves top 3 relevant chunks from Indian Constitution
5. Sends chunks + query to Gemini Pro
6. Returns AI-generated response to Node.js
7. Node.js returns response to frontend

## Endpoints

- `POST /chat` - RAG-powered chat
  - Body: `{ "message": "your question" }`
  - Response: `{ "reply": "AI response", "timestamp": "..." }`

- `POST /voice/start` - Start voice
  - Response: `{ "status": "start", "message": "...", "timestamp": "..." }`

- `POST /voice/stop` - Stop voice
  - Response: `{ "status": "stop", "timestamp": "..." }`

- `GET /health` - Health check

## Models Used

- **Embeddings**: Legal-BERT (nlpaueb/legal-bert-small-uncased)
- **LLM**: Gemini Pro
- **Vector DB**: FAISS (CPU)
