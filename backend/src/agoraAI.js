import axios from 'axios';

const AGORA_APP_ID = process.env.AGORA_APP_ID;
const CUSTOMER_ID = process.env.AGORA_CUSTOMER_ID;
const CUSTOMER_SECRET = process.env.AGORA_CUSTOMER_SECRET;
const RTC_TOKEN = process.env.AGORA_RTC_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY;

const credentials = Buffer.from(`${CUSTOMER_ID}:${CUSTOMER_SECRET}`).toString('base64');

let currentAgentId = null;

export const startAIAgent = async (req, res) => {
  const { channel, uid } = req.body;

  const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${AGORA_APP_ID}/join`;

  const data = {
    name: `lawease_agent_${Date.now()}`,
    properties: {
      channel: channel || "channel1",
      token: RTC_TOKEN,
      agent_rtc_uid: "1001",
      remote_rtc_uids: [uid || "0"],
      idle_timeout: 300,
      llm: {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        system_messages: [
          {
            parts: [{ text: "You are LaWEase, a legal assistant specialized in Indian Constitution and law. Provide clear, accurate legal information. Keep responses concise." }],
            role: "user"
          }
        ],
        max_history: 32,
        greeting_message: "Hello! I'm LaWEase, your legal assistant. How can I help you today?",
        failure_message: "I apologize, I'm having trouble. Could you rephrase?",
        params: { model: "gemini-2.0-flash" },
        style: "gemini"
      },
      tts: {
        vendor: "cartesia",
        params: {
          api_key: CARTESIA_API_KEY,
          model_id: "sonic-2",
          voice: { mode: "id", id: "a0e99841-438c-4a64-b679-ae501e7d6091" },
          output_format: { container: "raw", sample_rate: 16000 },
          language: "en"
        }
      },
      asr: { language: "en-US" }
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' }
    });

    currentAgentId = response.data.agent_id;
    res.json({ success: true, agent_id: response.data.agent_id, status: response.data.status });
  } catch (error) {
    console.error('Error starting AI agent:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};

export const stopAIAgent = async (req, res) => {
  const targetAgentId = req.body.agentId || currentAgentId;

  if (!targetAgentId) {
    return res.status(400).json({ success: false, error: 'No agent ID' });
  }

  const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${AGORA_APP_ID}/agents/${targetAgentId}/leave`;

  try {
    await axios.post(url, {}, {
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' }
    });

    currentAgentId = null;
    res.json({ success: true });
  } catch (error) {
    console.error('Error stopping AI agent:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};
