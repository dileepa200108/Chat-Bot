import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ValentineChatComponent = ({ game }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);  // Add sessionId state

  // Fetch initial message
  const fetchInitialMessage = async () => {
    try {
      const promptWithGame = `Hello`;

      const chatResponse = await axios.post("https://backend-test-production-ed922.up.railway.app/api/chat", {
        prompt: promptWithGame,
        sessionId: sessionId,  // Pass sessionId to backend
      });
      const aiMessage = { role: "ai", text: chatResponse.data.result };

      setMessages([aiMessage]);
    } catch (err) {
      console.error("Failed to fetch initial message:", err);
      setError("Failed to load initial message");
    }
  };

  // Scroll to the bottom of the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Open the chat when the component mounts
  useEffect(() => {
    if (isChatOpen) {
      if (!sessionId) {
        // Generate a new sessionId when the chat opens
        setSessionId(Date.now().toString());
      } else {
        fetchInitialMessage();
      }
    }
  }, [isChatOpen, sessionId]);

  // Handle user input
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    const userMessage = { role: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const promptWithGame = `You are Gwen, the gaming cupid for Valentine's Day.`;

      // Pass sessionId when sending a message to keep history
      const response = await axios.post("https://backend-test-production-ed922.up.railway.app/api/chat", {
        prompt: promptWithGame,
        sessionId: sessionId,  // Pass sessionId to backend
      });
      const aiMessage = { role: "ai", text: response.data.result };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setInput("");
    } catch (err) {
      setError("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle the chat
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 w-20 h-20 rounded-full p-0 bg-pink-500 hover:bg-pink-600 text-white shadow-lg z-50 flex items-center justify-center"
        >
          💌
        </button>
      )}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-full max-w-md mx-auto p-4 bg-pink-100 text-pink-800 rounded-lg shadow-2xl z-50 border-2 border-pink-500">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Gwen's Valentine Chat 💕</h1>
            <button onClick={toggleChat} className="text-pink-500 hover:text-pink-700">❌</button>
          </div>
          <p className="mb-2">Need help with {game}? Gwen's got you covered! 💘</p>
          <div className="h-80 overflow-y-auto p-3 bg-white rounded-md">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-md ${msg.role === "user" ? "bg-pink-200 text-right" : "bg-pink-300 text-left"}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-500">Gwen is typing... 💭</div>}
            {error && <div className="text-red-500">{error}</div>}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex mt-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Gwen... 💕"
              className="flex-1 p-2 rounded-l-md border border-pink-300 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send 💌"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ValentineChatComponent;
