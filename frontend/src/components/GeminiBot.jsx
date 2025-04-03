// ChatComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Chip } from "@nextui-org/react";

const CHARACTER_PROMPT = `Your Name is Crazy Diamond.. who is assistant to the Monarch Dileepa.  
  `;

const ChatComponent = () => {
  const [sessionId] = useState(Date.now().toString()); // Set once, never changes
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeChat();
  }, []); // Run once when component mounts

  const initializeChat = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://backend-test-production-ed922.up.railway.app/api/chat/init",
        {
          sessionId,
          characterPrompt: CHARACTER_PROMPT,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(res.data.result);
      setChatHistory([{ type: "ai", response: res.data.result }]);
    } catch (error) {
      console.error("Error:", error);
      setResponse(
        error.response?.data?.message || "Failed to initialize chat."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://backend-test-production-ed922.up.railway.app/api/chat",
        {
          sessionId,
          prompt: prompt.trim(),
          characterPrompt: CHARACTER_PROMPT,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(res.data.result);
      setChatHistory((prev) => [
        ...prev,
        { type: "user", prompt: prompt },
        { type: "ai", response: res.data.result },
      ]);
      setPrompt("");
    } catch (error) {
      console.error("Error:", error);
      setResponse(
        error.response?.data?.message ||
          "An error occurred while processing your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-md mx-auto p-4 bg-[url('https://res.cloudinary.com/dhcawltsr/image/upload/v1739538015/Cat_with_a_witch_hat-amico_mdlxze.svg')] bg-contain
 rounded-lg shadow-lg w-full min-h-screen sm:min-h-0 flex flex-col"
    >


      {/* Chat history should scroll instead of pushing content */}
      <div className="flex-grow overflow-y-auto max-h-[400px] font-f1">
        {chatHistory.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <ul className="space-y-2 sm:space-y-3">
              {chatHistory.map((entry, index) => (
                <li
                  key={index}
                  className="p-3 sm:p-4 bg-gray-100 rounded-lg shadow-sm text-sm sm:text-base"
                >
                  {entry.type === "user" ? (
                    <p>
                      <div className="flex items-center space-x-2">
                        <img
                          src="https://res.cloudinary.com/dhcawltsr/image/upload/v1739711193/cute-princess-chibi-girl-hand-drawn-cartoon-sticker-icon-concept-isolated-illustration_730620-93202_1_lrouie.avif"
                          alt="User Avatar"
                          className="w-10 h-10 sm:w-8 sm:h-8 rounded-full"
                        />
                        <Chip className="mb-2" variant="dot" color="success">
                          Clumsy
                        </Chip>
                      </div>
                      <div>{entry.prompt}</div>
                    </p>
                  ) : (
                    <p>
                      <div className="flex items-center space-x-2">
                        <img
                          src="https://res.cloudinary.com/dhcawltsr/image/upload/v1739535069/2b887d85197371.5d74f0d175dcd_rmmvwh.gif"
                          alt="User Avatar"
                          className="w-10 h-10 sm:w-8 sm:h-8 rounded-full"
                        />
                        <Chip className="mb-2" variant="dot" color="danger">
                          Clumsy
                        </Chip>
                      </div>
                      {entry.response}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form
        onSubmit={handleChatSubmit}
        className="space-y-3 sm:space-y-4 mt-auto"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Whisper your thoughts..."
          rows="3"
          className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading}
            className=" font-f1 w-[400px] bg-black text-white"
            size="lg"
          >
            {loading ? "Altering The dimension" : "Summon Crazy Diamond"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
