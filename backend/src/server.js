import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { startVoice, stopVoice } from './voiceResponse.js';
import { startAIAgent, stopAIAgent } from './agoraAI.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function callRagService(message, lawyerMode = false) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', [path.join(__dirname, '../rag_service.py')]);
    
    let output = '';
    let error = '';
    
    python.stdin.write(JSON.stringify({ message, lawyerMode }));
    python.stdin.end();
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'RAG service failed'));
      } else {
        try {
          const result = JSON.parse(output);
          resolve(result.response);
        } catch (e) {
          reject(new Error('Invalid response from RAG service'));
        }
      }
    });
  });
}

app.post('/chat', async (req, res) => {
  const { message, lawyerMode } = req.body;
  
  try {
    const reply = await callRagService(message, lawyerMode);
    res.json({
      reply,
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
