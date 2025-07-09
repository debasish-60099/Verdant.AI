import { ArrowUp, Mic, MicOff } from "lucide-react";
import { useState, useRef } from "react";
import { detectLanguage } from "../utils/languageUtils";
import { isSpeechRecognitionSupported, createSpeechRecognition, getLanguageCode } from "../utils/speechUtils";

const PromptForm = ({ conversations, setConversations, activeConversation, generateResponse, isLoading, setIsLoading, selectedLanguage }) => {
  const [promptText, setPromptText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Voice input functionality
  const startListening = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const languageCode = getLanguageCode(selectedLanguage);
    const recognition = createSpeechRecognition(languageCode);
    
    if (!recognition) return;

    recognitionRef.current = recognition;
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPromptText(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading || !promptText.trim()) return;
    
    setIsLoading(true);
    const currentConvo = conversations.find((convo) => convo.id === activeConversation) || conversations[0];
    
    // Detect input language
    const inputLanguage = detectLanguage(promptText);
    
    // Set conversation title from first message if new chat
    let newTitle = currentConvo.title;
    if (currentConvo.messages.length === 0) {
      newTitle = promptText.length > 25 ? promptText.substring(0, 25) + "..." : promptText;
    }
    
    // Add user message with detected language
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
      language: inputLanguage
    };
    
    // Create API conversation without the "thinking" message
    const apiConversation = {
      ...currentConvo,
      messages: [...currentConvo.messages, userMessage],
    };
    
    // Update UI with user message
    setConversations(conversations.map((conv) => 
      conv.id === activeConversation 
        ? { ...conv, title: newTitle, messages: [...conv.messages, userMessage] } 
        : conv
    ));
    
    // Clear input
    setPromptText("");
    
    // Add bot response after short delay for better UX
    setTimeout(() => {
      const botMessageId = `bot-${Date.now()}`;
      const botMessage = {
        id: botMessageId,
        role: "bot",
        content: "Just a sec...",
        loading: true,
        language: inputLanguage // Bot should respond in the same language
      };
      
      // Only update the UI with the thinking message, not the conversation for API
      setConversations((prev) => 
        prev.map((conv) => 
          conv.id === activeConversation 
            ? { ...conv, title: newTitle, messages: [...conv.messages, botMessage] } 
            : conv
        )
      );
      
      // Pass the API conversation without the thinking message
      generateResponse(apiConversation, botMessageId, inputLanguage);
    }, 300);
  };

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <input 
        placeholder="Message Verdant AI..." 
        className="prompt-input" 
        value={promptText} 
        onChange={(e) => setPromptText(e.target.value)} 
        required 
      />
      {isSpeechRecognitionSupported() && (
        <button 
          type="button" 
          className={`voice-input-btn ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          title={isListening ? "Stop listening" : "Voice input"}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
      )}
      <button type="submit" className="send-prompt-btn">
        <ArrowUp size={20} />
      </button>
    </form>
  );
};

export default PromptForm;

