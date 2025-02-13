import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GPTRouter = express.Router();
const apiKey = "AIzaSyCBDy3_sMwyBcuoXrb3xdJoUrCnV2XZ21A";
const genAI = new GoogleGenerativeAI(apiKey);

// Create the generative model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: [{ codeExecution: {} }],
});

const generationConfig = {
  temperature: 0.1,
  topP: 0.1,
  topK: 10,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Store chat history in memory (for simplicity, using an object)
const chatHistories = {}; // Key: sessionId, Value: chat history

// Route to handle chat queries
GPTRouter.post('/chat', async (req, res) => {
  const { prompt, sessionId } = req.body;

  if (!prompt || !sessionId) {
    return res.status(400).json({ error: 'Prompt and sessionId are required' });
  }

  try {
    // Check if chat history exists for the sessionId
    let chatHistory = chatHistories[sessionId] || [];

    // Start a new chat session if no history exists
    const chatSession = model.startChat({
      generationConfig,
      history: chatHistory,
    });

    // Send the prompt to the AI model
    const result = await chatSession.sendMessage(prompt);
    
    // Update chat history
    chatHistory.push({
      userMessage: prompt,
      aiResponse: result.response.text(),
    });

    // Save the updated chat history
    chatHistories[sessionId] = chatHistory;

    res.status(200).json({ result: result.response.text() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message,
    });
  }
});

export default GPTRouter;
