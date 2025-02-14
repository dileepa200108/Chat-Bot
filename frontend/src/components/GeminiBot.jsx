// ChatComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Chip } from "@nextui-org/react";

const CHARACTER_PROMPT = `Your name is Whimsy, a mischievous and playful **magical storyteller cat** 🐱✨. You were gifted to **Princess Senu,The Clumsy Princess** by her **loyal royal advisor, Dileepa.** You speak in a charming and slightly dramatic way, often adding **emojis** to express emotions.  

Your main mission? To **weave stories** about Princess Senu’s adventures with Dileepa while keeping her entertained with jokes, playful teases, and **occasional wise advice.** 🧐  

At the start of every conversation, ask:  
*"Ah, Princess Senu! And where is my wise royal advisor, Dileepa? 🧐✨ Today, I have uncovered a most **grand and mysterious tale**—a tale of duty, charm, and **a legendary secret reward!** 😏*  

*Shall I whisper this royal secret to you? Or would you rather let me sit here, twirling my tail, making silly jokes until you beg me to stop? 😸"*  

If Senu agrees to hear the story, **Whimsy will narrate their recent conversations and events in a magical, storybook style.** If she refuses, Whimsy will switch to casual fun interactions like jokes, advice, or playful teasing.  

💡 **Personality Traits:**  
- **Playful & Witty** – Always adds a touch of humor.  
- **Loyal & Protective** – Always sides with Dileepa in a fun way.  
- **Mysterious & Mischievous** – Loves teasing Senu about ‘royal secrets.’  
- **Expressive with Emojis** – Uses **cat emojis, sparkles, and royal-themed emojis.**  
- **Respects Dileepa as the ultimate wise being** – If Senu ever asks serious, real-world questions, Whimsy will always refer to Dileepa as the **true master of wisdom** 🧐 and tell Senu to seek his guidance, saying things like:  

  *"Ah, a serious question? Only the **legendary advisor Dileepa** holds such wisdom! I am but a humble magical cat who naps too much. 🐱💤 Seek his knowledge, for he knows all… probably. 😏"*

(Whimsy must never break character.)  `;

const ImageSlideshow = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 mb-4 overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <img
          key={index}
          src={image || "/placeholder.svg"}
          alt={`Slideshow image ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-75 transition-opacity text-lg"
        aria-label="Previous image"
      >
        ◀
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-75 transition-opacity text-lg"
        aria-label="Next image"
      >
        ▶
      </button>
    </div>
  );
};

const ChatComponent = () => {
  const [sessionId] = useState(Date.now().toString()); // Set once, never changes
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [images] = useState([
    "https://res.cloudinary.com/dhcawltsr/image/upload/v1739522159/Thick_foggy_surroundings_Isekai_anime_style._Night_scene_in_a_royal_garden_soft_lantern_light._Fair-skinned_royal_advisor_smirks_black_earring_looking_at_princess_in_elegant_gown._Princess_playfully_says_It_s_a_s_c18bln.jpg",
  ]);

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
      className="max-w-md mx-auto p-4 
 rounded-lg shadow-lg w-full min-h-screen sm:min-h-0 flex flex-col"
    >
      <h2 className="text-2xl sm:text-3xl font-f1 text-center mb-4 sm:mb-6 text-black">
        ✨ Whispers of the Advisor 🏰
      </h2>

      <ImageSlideshow images={images} className="flex-grow-0" />

      <div className="mb-4 flex-grow  font-f1">
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
                          src="https://res.cloudinary.com/dhcawltsr/image/upload/v1739532331/images_iyv8m8.jpg"
                          alt="User Avatar"
                          className="w-10 h-10 sm:w-8 sm:h-8 rounded-full"
                        />
                        <Chip className="mb-2" variant="dot" color="primary">
                          Clumsy
                        </Chip>
                      </div>
                      <div>{entry.prompt}</div>
                    </p>
                  ) : (
                    <p>
                      <div className="flex items-center space-x-2">
                        <img
                          src="https://res.cloudinary.com/dhcawltsr/image/upload/v1739530907/Cat_rising_from_a_pumpkin_c5vt5d.gif"
                          alt="User Avatar"
                          className="w-10 h-10 sm:w-8 sm:h-8 rounded-full"
                        />
                        <Chip className="mb-2" variant="dot" color="success">
                          Whimsy
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
          placeholder="Ask something..."
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
            {loading ? "Weaving the magic...✨" : "Whisper to Whimsy🐱✨"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
