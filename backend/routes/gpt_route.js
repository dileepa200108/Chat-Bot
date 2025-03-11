// GPTRouter.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GPTRouter = express.Router();
const apiKey = "AIzaSyAat2iMvyHFCAz-PuDS7b6slVU8EsF8ono";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "tunedModels/sales-bot-401s72yvdn7j",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.1,
  topK: 10,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const sessions = new Map();
const invoices = [
  { id: "X", amount: 1000, customer: "John Doe", date: "2025-03-08" },
  { id: "Y", amount: 500, customer: "Jane Smith", date: "2025-03-08" },
  { id: "Z", amount: 200, customer: "Mike Johnson", date: "2025-03-07" },
];

const filterByInvoiceId = (invoices, invoiceId) => invoices.find(inv => inv.id === invoiceId) || "Invoice not found";
const filterByAmountAbove = (invoices, amount) => invoices.filter(inv => inv.amount > amount);
const filterByDate = (invoices, date) => invoices.filter(inv => inv.date === date);

// 🔥 Function registry to avoid "not a function" errors
const functionRegistry = {
  filterByInvoiceId,
  filterByAmountAbove,
  filterByDate
};

// 🟢 Initialize Chat Session (Auto-Create If Missing)
GPTRouter.post("/chat/init", async (req, res) => {
  const { sessionId, characterPrompt } = req.body;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Valid sessionId is required" });
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

    // Start chat with a friendly introduction
    const result = await chatSession.sendMessage(
      `${characterPrompt} Introduce yourself and start a friendly conversation.`
    );

    res.status(200).json({
      result: result.response
        .text()
        .replace(/```json|```/g, "")
        .trim(),
    });
  } catch (error) {
    console.error("Error initializing chat:", error);
    res.status(500).json({
      error: "Failed to initialize chat",
      message: error.message || "An unexpected error occurred",
    });
  }
});

// 🟢 Chat Route (Auto-Create Session & AI Query Execution)
GPTRouter.post("/chat", async (req, res) => {
  const { sessionId, prompt } = req.body;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Valid sessionId is required" });
  }
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Valid prompt is required" });
  }

  try {
    let sessionData = sessions.get(sessionId);

    // 🔥 Auto-create session if missing
    if (!sessionData) {
      console.log(`Session ${sessionId} not found. Creating a new session...`);

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      sessionData = {
        session: chatSession,
        characterPrompt: "You are a business assistant. Answer professionally.",
      };

      sessions.set(sessionId, sessionData);
    }

    console.log("User Prompt:", prompt);

    // 🔥 AI selects the best narrowing function
    const aiFunctionSelection = await sessionData.session.sendMessage(
      `You are an AI assistant helping process invoice data. Given a user question, follow these steps:
  1. Choose the best narrowing function (if needed).
  2. If no function is needed, return "none".
  3. Provide JSON output ONLY.

  **Available narrowing functions:**  
  - filterByInvoiceId(invoices, invoiceId)  
  - filterByAmountAbove(invoices, amount)  
  - filterByDate(invoices, date)  

  **Example Outputs:**
  - Question: "Tell me the total amount of invoice 'X'?"
    → {"narrowingFunction": "filterByInvoiceId", "arguments": ["X"]}

  - Question: "List all invoices above $500"
    → {"narrowingFunction": "filterByAmountAbove", "arguments": [500]}

  - Question: "Show invoices from 2025-03-08"
    → {"narrowingFunction": "filterByDate", "arguments": ["2025-03-08"]}

  - Question: "Give me a summary of all invoices"
    → {"narrowingFunction": "none"}

  **User's Question:** "${prompt}"  
  Return ONLY JSON, NO explanations.`
    );

    // ✅ Fix: Remove code block markers before parsing JSON
    const aiResponseText = aiFunctionSelection.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const narrowingDecision = JSON.parse(aiResponseText);
    console.log("AI Decision:", narrowingDecision);

    let narrowedData = invoices;  // Default: Use full data
    const functionName = narrowingDecision.narrowingFunction;
    const functionArgs = narrowingDecision.arguments;
    
    if (functionName !== "none") {
      const selectedFunction = functionRegistry[functionName];  // 🔥 Get function safely
      
      if (selectedFunction) {
        narrowedData = selectedFunction(invoices, ...functionArgs);  // ✅ Correct execution
      } else {
        console.error(`Function "${functionName}" is not defined!`);
        return res.status(500).json({ error: `Function "${functionName}" does not exist.` });
      }
    }
    
    console.log("Narrowed Data:", narrowedData);

    // 🔥 AI generates the final response based on the narrowed data
    const aiFinalResponse = await sessionData.session.sendMessage(
      `Here is the relevant data: ${JSON.stringify(narrowedData)}
      Based on this, generate a clear, human-friendly response for the user.
      Do NOT include JSON in the response.`
    );

    // ✅ Fix: Remove code block markers before sending the response
    res.status(200).json({ response: aiFinalResponse.response.text() });

    console.log(
      "AI Response:",
      aiFinalResponse.response
        .text()
        .replace(/```json|```/g, "")
        .trim()
    );
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({
      error: "AI processing failed",
      message: error.message || "Unexpected error",
    });
  }
});

export default GPTRouter;
