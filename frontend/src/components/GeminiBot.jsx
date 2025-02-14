// ChatComponent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CHARACTER_PROMPT = 'Your name is Gwen. You are an 11 years old child.';

const ChatComponent = () => {
  const [sessionId] = useState(Date.now().toString()); // Set once, never changes
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeChat();
  }, []); // Run once when component mounts

  const initializeChat = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/chat/init', {
        sessionId,
        characterPrompt: CHARACTER_PROMPT,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResponse(res.data.result);
      setChatHistory([{ type: 'ai', response: res.data.result }]);
    } catch (error) {
      console.error('Error:', error);
      setResponse(error.response?.data?.message || 'Failed to initialize chat.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert('Please enter a prompt!');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/chat', {
        sessionId,
        prompt: prompt.trim(),
        characterPrompt: CHARACTER_PROMPT,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResponse(res.data.result);
      setChatHistory((prev) => [...prev, 
        { type: 'user', prompt: prompt },
        { type: 'ai', response: res.data.result }
      ]);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setResponse(error.response?.data?.message || 'An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Chat with Gwen</h2>
      
      <div className="mb-4">
        {chatHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Chat History</h3>
            <ul className="space-y-2">
              {chatHistory.map((entry, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  {entry.type === 'user' ? (
                    <p><strong className="text-blue-600">You:</strong> {entry.prompt}</p>
                  ) : (
                    <p><strong className="text-green-600">Gwen:</strong> {entry.response}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleChatSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
          rows="4"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;