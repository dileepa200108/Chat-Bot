import React, { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [sessionId, setSessionId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChatSubmit = async (e) => {
    e.preventDefault();

    // Check if prompt is empty
    if (!prompt.trim()) {
      alert('Please enter a prompt!');
      return;
    }

    setLoading(true);
    try {
      // Ensure sessionId exists; if not, generate one
      if (!sessionId) {
        setSessionId(Date.now().toString()); // Generate sessionId if not set
      }

      // Send request with sessionId and prompt
      const res = await axios.post('http://localhost:3000/api/chat', {
        sessionId,
        prompt,
      });

      setResponse(res.data.result);
      setChatHistory((prev) => [...prev, { prompt, response: res.data.result }]);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Chat with AI</h2>
      
      <div className="mb-4">
        {chatHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Chat History</h3>
            <ul className="space-y-2">
              {chatHistory.map((entry, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <p><strong className="text-blue-600">You:</strong> {entry.prompt}</p>
                  <p><strong className="text-green-600">AI:</strong> {entry.response}</p>
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

      {response && (
        <div className="mt-6 p-4 bg-gray-200 rounded-lg">
          <h3 className="text-xl font-medium">AI Response:</h3>
          <p className="text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
