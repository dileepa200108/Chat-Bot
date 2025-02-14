// GPTRouter.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GPTRouter = express.Router();
const apiKey = "AIzaSyAat2iMvyHFCAz-PuDS7b6slVU8EsF8ono";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: [{ codeExecution: {} }],
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.1,
  topK: 10,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const sessions = new Map();

// Initialize chat route
GPTRouter.post('/chat/init', async (req, res) => {
  const { sessionId, characterPrompt } = req.body;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Valid sessionId is required' });
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    sessions.set(sessionId, {
      session: chatSession,
      characterPrompt,
    });

    // Send initial character prompt and request an introduction
    const result = await chatSession.sendMessage(
      `${characterPrompt} Introduce yourself and start a friendly conversation.`
    );
    
    res.status(200).json({ result: result.response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to initialize chat',
      message: error.message || 'An unexpected error occurred',
    });
  }
});

// Regular chat route
GPTRouter.post('/chat', async (req, res) => {
  const { sessionId, prompt } = req.body;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Valid sessionId is required' });
  }

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Valid prompt is required' });
  }

  try {
    const sessionData = sessions.get(sessionId);
    if (!sessionData) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const result = await sessionData.session.sendMessage(prompt);
    const responseText = result.response.text();
    
    res.status(200).json({ result: responseText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message || 'An unexpected error occurred',
    });
  }
});

export default GPTRouter;