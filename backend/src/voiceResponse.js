export const startVoice = (req, res) => {
  const { text } = req.body;
  const message = text || "Hello there, I'm Law Ease";
  
  res.json({ 
    status: 'start',
    message: message,
    timestamp: new Date().toISOString()
  });
};

export const stopVoice = (req, res) => {
  res.json({ 
    status: 'stop',
    timestamp: new Date().toISOString()
  });
};
