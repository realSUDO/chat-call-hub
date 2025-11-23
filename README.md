# LaWEase

Your personal legal assistant for navigating Indian law. Get instant answers to legal questions, stay updated with the latest legal developments, and consult with an AI-powered voice assistant.

## What is LaWEase?

LaWEase helps you understand complex legal matters without the jargon. Whether you're curious about your constitutional rights, need clarity on a legal procedure, or want to stay informed about new laws and bills, LaWEase has you covered.

## Features

### 💬 Chat Assistant
Ask anything about Indian law and get accurate, context-aware responses. The assistant uses RAG (Retrieval-Augmented Generation) to pull relevant information from the Indian Constitution and provide detailed explanations.

### 🎙️ Voice Consultation
Talk to your legal assistant just like you would with a real lawyer. The voice feature lets you have natural conversations about your legal queries - perfect when you're on the go or prefer speaking over typing.

### 📰 Legal Feed
Stay in the loop with important legal updates, new bills, amendments, and court rulings. The feed curates relevant legal news so you don't miss what matters.

## Tech Stack

**Frontend**
- React with TypeScript
- Vite for blazing fast development
- Tailwind CSS + shadcn-ui for the interface
- Agora RTC SDK for voice calls

**Backend**
- Express.js server
- Flask for the RAG service
- Legal-BERT embeddings with FAISS vector search
- Google Gemini for natural language generation
- Cartesia for text-to-speech

**AI & Voice**
- Agora Conversational AI agent
- Gemini 2.0 Flash for voice conversations
- Cartesia Sonic-2 for natural-sounding speech

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or bun

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd lawease
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
pip install -r requirements.txt
```

4. Set up environment variables

Create `.env` in the root directory:
```
VITE_AGORA_APP_ID=your_agora_app_id
VITE_AGORA_CHANNEL=channel1
VITE_AGORA_TOKEN=your_agora_token
```

Create `.env` in the backend directory:
```
GEMINI_API_KEY=your_gemini_api_key
AGORA_APP_ID=your_agora_app_id
AGORA_CUSTOMER_ID=your_customer_id
AGORA_CUSTOMER_SECRET=your_customer_secret
AGORA_RTC_TOKEN=your_rtc_token
CARTESIA_API_KEY=your_cartesia_key
```

### Running the Application

You'll need three terminal windows:

**Terminal 1 - RAG Service**
```bash
cd backend
python3 rag_server.py
```

**Terminal 2 - Express Backend**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How It Works

The chat assistant uses a RAG pipeline that:
1. Converts your question into embeddings using Legal-BERT
2. Searches a FAISS vector database containing the Indian Constitution
3. Retrieves the most relevant legal text
4. Generates a natural response using Gemini with proper context

The voice assistant connects you to an Agora AI agent that can understand your questions and respond naturally using advanced speech recognition and synthesis.

## Project Structure

```
lawease/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Main pages (Landing, Index)
│   ├── services/       # API and Agora integration
│   └── data/           # Static data and content
├── backend/
│   ├── src/            # Express server
│   ├── rag_server.py   # Flask RAG service
│   └── rag_service.py  # RAG logic
└── public/             # Static assets
```

## Contributing

Found a bug or have a feature idea? Feel free to open an issue or submit a pull request.

## License

This project is built for educational purposes.

---

**Note:** LaWEase is an AI-powered assistant and should not replace professional legal advice. Always consult with a qualified lawyer for serious legal matters.
