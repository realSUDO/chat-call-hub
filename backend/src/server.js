import express from 'express';
import cors from 'cors';
import { startVoice, stopVoice } from './voiceResponse.js';
import { startAIAgent, stopAIAgent } from './agoraAI.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    const response = await fetch('http://localhost:5001/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    
    res.json({
      reply: data.response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('RAG Error:', error);
    res.status(500).json({
      reply: "I'm having trouble accessing the knowledge base. Please try again.",
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/voice/start', startVoice);
app.post('/voice/stop', stopVoice);

app.post('/ai/start', startAIAgent);
app.post('/ai/stop', stopAIAgent);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
