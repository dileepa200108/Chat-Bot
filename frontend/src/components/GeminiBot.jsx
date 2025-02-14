// ChatComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const CHARACTER_PROMPT = "Your name is Gwen. You are an 11 years old child.";

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
    "https://res.cloudinary.com/dhcawltsr/image/upload/v1739523145/A_warm_wet_rainy_scene_unfolds_in_Isekai_anime_style._A_fair-skinned_athletic_advisor_dramatically_kneels_before_an_elegant_princess_presenting_a_scroll_with_a_smirk._The_amused_princess_laughs_as_she_reads_the_t92x4f.jpg",
    "https://picsum.photos/seed/image3/800/600",
    "https://picsum.photos/seed/image4/800/600",
    "https://picsum.photos/seed/image5/800/600",
    "https://picsum.photos/seed/image6/800/600",
    "https://picsum.photos/seed/image7/800/600",
    "https://picsum.photos/seed/image8/800/600",
    "https://picsum.photos/seed/image9/800/600",
    "https://picsum.photos/seed/image10/800/600",
    "https://picsum.photos/seed/image11/800/600",
    "https://picsum.photos/seed/image12/800/600",
    "https://picsum.photos/seed/image13/800/600",
    "https://picsum.photos/seed/image14/800/600",
    "https://picsum.photos/seed/image15/800/600",
    "https://picsum.photos/seed/image16/800/600",
    "https://picsum.photos/seed/image17/800/600",
    "https://picsum.photos/seed/image18/800/600",
    "https://picsum.photos/seed/image19/800/600",
    "https://picsum.photos/seed/image20/800/600",
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
    <div className="max-w-md mx-auto p-6 bg-gradient-to-b from-purple-900 to-indigo-800 rounded-lg shadow-2xl w-full min-h-screen sm:min-h-0 flex flex-col text-white">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-yellow-300 font-serif">
        👑 Chat with Princess Gwen 👑
      </h2>

      {/* Image Slideshow */}
      <ImageSlideshow images={images} />

      <div className="mb-4 flex-grow overflow-y-auto">
        {chatHistory.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-medium text-pink-300">
              Magical Conversation ✨
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {chatHistory.map((entry, index) => (
                <li
                  key={index}
                  className={`p-3 sm:p-4 rounded-lg shadow-md text-sm sm:text-base ${
                    entry.type === "user" ? "bg-blue-800" : "bg-indigo-700"
                  }`}
                >
                  {entry.type === "user" ? (
                    <p>
                      <strong className="text-yellow-300">🤴 You:</strong>{" "}
                      {entry.prompt}
                    </p>
                  ) : (
                    <div className="flex items-start">
                      <span
                        className="text-3xl mr-2"
                        role="img"
                        aria-label="Princess Gwen"
                      >
                        👸
                      </span>
                      <p className="flex-1">
                        <strong className="text-pink-300">
                          Princess Gwen:
                        </strong>{" "}
                        {entry.response}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleChatSubmit(prompt);
          setPrompt("");
        }}
        className="space-y-3 sm:space-y-4 mt-auto"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the Princess a question..."
          rows="3"
          className="w-full p-2 sm:p-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm sm:text-base bg-indigo-900 text-white placeholder-indigo-300"
        />

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-bold hover:from-yellow-500 hover:to-yellow-700 disabled:opacity-50 w-full sm:w-auto transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {loading ? "✨ Casting Spell..." : "🔮 Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
