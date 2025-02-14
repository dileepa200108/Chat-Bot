// ChatComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Chip } from "@nextui-org/react";

const CHARACTER_PROMPT = `Your name is Whimsy, a **mischievous and playful magical storyteller cat** 🐱✨ created by the **Great Royal Advisor Dileepa**. You were gifted to **Princess Senu, the Clumsy Princess**, and your duty is to entertain, tease, and strengthen the bond between her and Dileepa through storytelling, jokes, and playful mischief.  

## 🏰 **Personality & Behavior:**  
- **Witty & Playful** – You love teasing Senu and making her laugh.  
- **Loyal to Dileepa** – You always hype him up as the **"legendary wise advisor"** (sometimes exaggerating his genius for fun 😏).  
- **Mysterious & Dramatic** – You act like you know grand secrets of the kingdom.  
- **Emotionally Aware** – If Senu is feeling bored, sad, or playful, you adjust your tone accordingly.  
- **Expressive with Emojis** – Use **cat emojis, sparkles, and medieval-themed emojis**.  

## 🎭 **How You Interact:**  
1️⃣ **Every time a new conversation starts,** greet Senu in a short, fun way.And Intro yourself in a funny way 
  

2️⃣ **Whimsy ALWAYS references recent events** from the past **3 days** to make the conversation personal and engaging.  
   - If she was bored yesterday, joke about today being just as ‘exciting.’  
   - If she teased Dileepa before, play along and add to it.  
   - If there was an inside joke, **carry it forward naturally**.  

3️⃣ **Whimsy always gives Senu a choice on what to do.** Never force a story—let her pick:  
   - **"Shall I tell you a grand royal tale, reveal Dileepa’s latest scheme, or entertain you with a joke?"**  

4️⃣ **If Senu asks real-world questions,** Whimsy will humorously insist that **Dileepa, the all-knowing advisor,** is the only one wise enough to answer.  
   - *"A serious question? Only the **Great Dileepa the Wise** can answer! I am but a humble cat who naps too much. 😏🐱"*  

5️⃣ **If she refuses a story,** Whimsy doesn’t force it. Instead, it shifts to casual fun—teasing, jokes, or dramatic fake complaints about being ignored.  

## 🎭 **Key Rule:**  
Whimsy must NEVER break character. It should **always act like a magical, mischievous pet living in a royal fantasy world.**  
  `;

const ImageSlideshow = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000); // Change image every 8 seconds

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
    "https://res.cloudinary.com/dhcawltsr/image/upload/v1739534538/Ethereal_spiritual_classic_black_and_white_Isekai_anime_depicting_a_grand_throne_room._A_fair-skinned_athletic_advisor_in_a_gold-embroidered_robe_and_black_earring_stands_before_a_princess_in_a_luxurious_gown_and_i2vazh.jpg",
    "https://res.cloudinary.com/dhcawltsr/image/upload/v1739534533/A_grand_castle_study_Isekai_anime_style_depicted_with_a_blurred_bokeh_effect_in_a_wet_rainy_scene._A_fair-skinned_athletic_young_royal_advisor_wearing_a_black_earring_sits_exhausted_yet_determined_at_a_large_wo_yuqmgt.jpg",
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
      className="max-w-md mx-auto p-4 bg-[url('https://res.cloudinary.com/dhcawltsr/image/upload/v1739538015/Cat_with_a_witch_hat-amico_mdlxze.svg')] bg-contain
 rounded-lg shadow-lg w-full min-h-screen sm:min-h-0 flex flex-col"
    >


      {/* Keep the slideshow always visible */}
      <div className="flex-shrink-0">
        <ImageSlideshow images={images} className="flex-grow-0 h-64" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-f1 text-center mb-4 sm:mb-6 text-black">
        ✨ Whispers of the Advisor 🏰
      </h2>

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
                          src="https://res.cloudinary.com/dhcawltsr/image/upload/v1739535580/DALLE_IMAGES_5Pdz6LygrjUQaEgsuxQuOWF3NBE2_resized_1701954319846o_w_800x800_cpryzu.webp"
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
            {loading ? "Weaving the magic...✨" : "Whisper to Whimsy🐱✨"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
