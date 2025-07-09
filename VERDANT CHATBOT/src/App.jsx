import { useEffect, useRef, useState } from "react";
import Message from "./components/Message";
import PromptForm from "./components/PromptForm";
import Sidebar from "./components/Sidebar";
import { Menu } from "lucide-react";
import { loadVoices } from "./utils/languageUtils";
import { downloadConversationPDF } from "./utils/pdfUtils";

const App = () => {
  // Main app state
  const [isLoading, setIsLoading] = useState(false);
  const typingInterval = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });
  const [conversations, setConversations] = useState(() => {
    try {
      // Load conversations from localStorage or use default
      const saved = localStorage.getItem("conversations");
      return saved ? JSON.parse(saved) : [{ id: "default", title: "New Chat", messages: [] }];
    } catch {
      return [{ id: "default", title: "New Chat", messages: [] }];
    }
  });
  const [activeConversation, setActiveConversation] = useState(() => {
    return localStorage.getItem("activeConversation") || "default";
  });
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "en";
  });
  const [researchMode, setResearchMode] = useState(() => {
    return localStorage.getItem("researchMode") === "true" || false;
  });

  // Load voices on component mount
  useEffect(() => {
    loadVoices();
  }, []);

  useEffect(() => {
    localStorage.setItem("activeConversation", activeConversation);
  }, [activeConversation]);

  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  // Handle theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Get current active conversation
  const currentConversation = conversations.find((c) => c.id === activeConversation) || conversations[0];

  // Scroll to bottom of container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Effect to scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [conversations, activeConversation]);

  const typingEffect = (text, messageId) => {
    let textElement = document.querySelector(`#${messageId} .text`);
    if (!textElement) return;
    
    // Initially set the content to empty and mark as loading
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: conv.messages.map((msg) => (msg.id === messageId ? { ...msg, content: "", loading: true } : msg)),
            }
          : conv
      )
    );
    
    // Set up typing animation
    textElement.textContent = "";
    const words = text.split(" ");
    let wordIndex = 0;
    let currentText = "";
    
    clearInterval(typingInterval.current);
    typingInterval.current = setInterval(() => {
      if (wordIndex < words.length) {
        // Update the current text being displayed
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
        textElement.textContent = currentText;
        
        // Update state with current progress
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversation
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) => (msg.id === messageId ? { ...msg, content: currentText, loading: true } : msg)),
                }
              : conv
          )
        );
        scrollToBottom();
      } else {
        // Animation complete
        clearInterval(typingInterval.current);
        
        // Final update, mark as finished loading
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversation
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) => (msg.id === messageId ? { ...msg, content: currentText, loading: false } : msg)),
                }
              : conv
          )
        );
        setIsLoading(false);
      }
    }, 40);
  };

  // Generate AI response with language awareness and research mode
  const generateResponse = async (conversation, botMessageId, inputLanguage = 'en') => {
    // Format messages for API
    const formattedMessages = conversation.messages?.map((msg) => ({
      role: msg.role === "bot" ? "model" : msg.role,
      parts: [{ text: msg.content }],
    }));

    // Add language instruction based on input language
    const languageInstructions = {
      'en': 'Please respond in English.',
      'hi': 'Please respond in Hindi (हिंदी में जवाब दें).',
      'bn': 'Please respond in Bengali (বাংলায় উত্তর দিন).',
      'gu': 'Please respond in Gujarati (ગુજરાતીમાં જવાબ આપો).',
      'kn': 'Please respond in Kannada (ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ).',
      'ml': 'Please respond in Malayalam (മലയാളത്തിൽ ഉത്തരം നൽകുക).',
      'mr': 'Please respond in Marathi (मराठीत उत्तर द्या).',
      'ta': 'Please respond in Tamil (தமிழில் பதிலளிக்கவும்).',
      'te': 'Please respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి).',
      'ur': 'Please respond in Urdu (اردو میں جواب دیں).'
    };

    const languageInstruction = languageInstructions[inputLanguage] || languageInstructions['en'];
    
    // Add research mode context if enabled
    let contextInstruction = '';
    if (researchMode) {
      contextInstruction = ' You are an environmental specialist focused on plant diseases, plant health, environmental conservation, sustainable agriculture, and plant recovery processes. Provide detailed, scientific, and practical information about environmental topics, plant care, disease identification, treatment methods, and eco-friendly solutions.';
    }
    
    // Add language and context instructions to the last user message
    if (formattedMessages.length > 0) {
      const lastMessage = formattedMessages[formattedMessages.length - 1];
      lastMessage.parts[0].text += ` ${languageInstruction}${contextInstruction}`;
    }

    try {
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedMessages }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message);
      
      // Clean up response formatting
      const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
      typingEffect(responseText, botMessageId);
    } catch (error) {
      setIsLoading(false);
      updateBotMessage(botMessageId, error.message, true);
    }
  };

  // Update specific bot message
  const updateBotMessage = (botId, content, isError = false) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: conv.messages.map((msg) => (msg.id === botId ? { ...msg, content, loading: false, error: isError } : msg)),
            }
          : conv
      )
    );
  };

  // Handle conversation PDF download
  const handleDownloadConversationPDF = () => {
    if (currentConversation.messages.length === 0) {
      alert('No messages to download');
      return;
    }
    
    const success = downloadConversationPDF(currentConversation, selectedLanguage);
    if (!success) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className={`app-container ${theme === "light" ? "light-theme" : "dark-theme"}`}>
      <div className={`overlay ${isSidebarOpen ? "show" : "hide"}`} onClick={() => setIsSidebarOpen(false)}></div>
      <Sidebar 
        conversations={conversations} 
        setConversations={setConversations} 
        activeConversation={activeConversation} 
        setActiveConversation={setActiveConversation} 
        theme={theme} 
        setTheme={setTheme} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        researchMode={researchMode}
        setResearchMode={setResearchMode}
      />
      <main className="main-container">

        {currentConversation.messages.length === 0 ? (
          // Welcome container
          <div className="welcome-container">
            <img className="welcome-logo" src="verdant-ai.svg" alt="Verdant AI Logo" />
            <h1 className="welcome-heading">Message Verdant AI</h1>
            <p className="welcome-text">
              {researchMode 
                ? "Research Mode: Specialized for plant diseases, environmental solutions, and plant recovery processes. Ask about plant health, disease identification, treatment methods, and eco-friendly solutions!"
                : "Explore sustainability and environmental solutions. Ask about eco-friendly practices, conservation, and more!"
              }
            </p>
            <p className="language-support">
              Supports 10 languages: English, Hindi (हिंदी), Bengali (বাংলা), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), and Urdu (اردو)
            </p>
          </div>
        ) : (
          // Messages container
          <div className="messages-container" ref={messagesContainerRef}>
            {currentConversation.messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        )}
        {/* Prompt input */}
        <div className="prompt-container">
          <div className="prompt-wrapper">
            <PromptForm 
              conversations={conversations} 
              setConversations={setConversations} 
              activeConversation={activeConversation} 
              generateResponse={generateResponse} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading}
              selectedLanguage={selectedLanguage}
            />
          </div>
          <p className="disclaimer-text">Verdant AI can make mistakes, so double-check it.</p>
        </div>
      </main>
    </div>
  );
};

export default App;

