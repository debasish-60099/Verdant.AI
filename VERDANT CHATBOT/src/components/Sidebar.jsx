import { Menu, Moon, Plus, Sparkles, Sun, Trash2, Languages, ChevronDown, Leaf, Download } from "lucide-react";
import { useState } from "react";
import { downloadConversationPDF } from "../utils/pdfUtils";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, conversations, setConversations, activeConversation, setActiveConversation, theme, setTheme, selectedLanguage, setSelectedLanguage, researchMode, setResearchMode }) => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // All Indian languages supported by Gemini API
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', bcp47: 'en-US' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', bcp47: 'hi-IN' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', bcp47: 'bn-BD' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', bcp47: 'gu-IN' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', bcp47: 'kn-IN' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', bcp47: 'ml-IN' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', bcp47: 'mr-IN' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', bcp47: 'ta-IN' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', bcp47: 'te-IN' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', bcp47: 'ur-PK' }
  ];

  // Handle research mode toggle
  const toggleResearchMode = () => {
    const newMode = !researchMode;
    setResearchMode(newMode);
    localStorage.setItem("researchMode", newMode.toString());
  };

  // Get current language info
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  // Handle language selection
  const handleLanguageSelect = (langCode) => {
    setSelectedLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Handle conversation PDF download
  const handleDownloadConversationPDF = () => {
    const currentConversation = conversations.find((c) => c.id === activeConversation);
    if (!currentConversation || currentConversation.messages.length === 0) {
      alert('No messages to download');
      return;
    }
    
    const success = downloadConversationPDF(currentConversation, selectedLanguage);
    if (!success) {
      alert('Failed to generate PDF. Please try again.');
    }
  };
  // Create new conversation
  const createNewConversation = () => {
    // Check if any existing conversation is empty
    const emptyConversation = conversations.find((conv) => conv.messages.length === 0);
    if (emptyConversation) {
      // If an empty conversation exists, make it active instead of creating a new one
      setActiveConversation(emptyConversation.id);
      return;
    }
    // Only create a new conversation if there are no empty ones
    const newId = `conv-${Date.now()}`;
    setConversations([{ id: newId, title: "New Chat", messages: [] }, ...conversations]);
    setActiveConversation(newId);
  };
  
  // Delete conversation and handle active selection
  const deleteConversation = (id, e) => {
    e.stopPropagation(); // Prevent triggering conversation selection
    // Check if this is the last conversation
    if (conversations.length === 1) {
      // Create new conversation with ID "default"
      const newConversation = { id: "default", title: "New Chat", messages: [] };
      setConversations([newConversation]);
      setActiveConversation("default"); // Set active to match the new conversation ID
    } else {
      // Remove the conversation
      const updatedConversations = conversations.filter((conv) => conv.id !== id);
      setConversations(updatedConversations);
      // If deleting the active conversation, switch to another one
      if (activeConversation === id) {
        // Find the first conversation that isn't being deleted
        const nextConversation = updatedConversations[0];
        setActiveConversation(nextConversation.id);
      }
    }
  };
  
  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen((prev) => !prev)}>
          <Menu size={18} />
        </button>
        <button className="new-chat-btn" onClick={createNewConversation}>
          <Plus size={20} />
          <span>New chat</span>
        </button>
      </div>
      {/* Conversation List */}
      <div className="sidebar-content">
        <h2 className="sidebar-title">Chat history</h2>
        <ul className="conversation-list">
          {conversations.map((conv) => (
            <li key={conv.id} className={`conversation-item ${activeConversation === conv.id ? "active" : ""}`} onClick={() => setActiveConversation(conv.id)}>
              <div className="conversation-icon-title">
                <div className="conversation-icon">
                  <Sparkles size={14} />
                </div>
                <span className="conversation-title">{conv.title}</span>
              </div>
              {/* Only show delete button if more than one chat or not a new chat */}
              <button className={`delete-btn ${conversations.length > 1 || conv.title !== "New Chat" ? "" : "hide"}`} onClick={(e) => deleteConversation(conv.id, e)}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
        
        {/* Research Mode Toggle */}
        <div className="research-mode-section">
          <div className="research-mode-header">
            <Leaf size={16} />
            <span>Research Mode</span>
          </div>
          <button
            className={`research-mode-toggle ${researchMode ? 'active' : ''}`}
            onClick={toggleResearchMode}
          >
            <div className="toggle-switch">
              <div className="toggle-slider"></div>
            </div>
            <span>{researchMode ? 'ON' : 'OFF'}</span>
          </button>
          {researchMode && (
            <p className="research-mode-description">
              SPECIALIZED FOR ENVIRONMENTS
            </p>
          )}
        </div>

        {/* Language Selection Dropdown */}
        <div className="language-section">
          <h3 className="language-title">
            <Languages size={16} />
            <span>Language</span>
          </h3>
          <div className="language-dropdown">
            <button
              className="language-dropdown-trigger"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <div className="language-current">
                <span className="language-flag">{currentLanguage.flag}</span>
                <span className="language-name">{currentLanguage.nativeName}</span>
              </div>
              <ChevronDown size={16} className={`dropdown-arrow ${isLanguageDropdownOpen ? 'open' : ''}`} />
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="language-dropdown-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${selectedLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <span className="language-flag">{lang.flag}</span>
                    <div className="language-info">
                      <span className="language-native">{lang.nativeName}</span>
                      <span className="language-english">{lang.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Theme Toggle and PDF Download */}
      <div className="sidebar-footer">
        {/* PDF Download Button */}
        {conversations.find((c) => c.id === activeConversation)?.messages.length > 0 && (
          <button className="download-conversation-btn" onClick={handleDownloadConversationPDF}>
            <Download size={20} />
            {isSidebarOpen && <span>Download PDF</span>}
          </button>
        )}
        <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? (
            <>
              <Moon size={20} />
              <span>Dark mode</span>
            </>
          ) : (
            <>
              <Sun size={20} />
              <span>Light mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

