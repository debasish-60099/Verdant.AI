import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Check, Download } from 'lucide-react';
import { detectLanguage, speakText, isSpeechSupported } from '../utils/languageUtils';
import { downloadMessagePDF } from '../utils/pdfUtils';

const Message = ({ message }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en');
  const [isCopied, setIsCopied] = useState(false);

  // Detect language when message content changes
  useEffect(() => {
    if (message.content && message.role === 'bot') {
      const lang = detectLanguage(message.content);
      setDetectedLanguage(lang);
    }
  }, [message.content]);

  // Handle speech synthesis
  const handleSpeak = () => {
    if (!isSpeechSupported()) {
      alert('Speech synthesis is not supported in your browser');
      return;
    }

    if (isPlaying) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Start speaking
      setIsPlaying(true);
      speakText(message.content, detectedLanguage);
      
      // Listen for speech end
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = message.content;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    const success = downloadMessagePDF(message, detectedLanguage);
    if (!success) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div id={message.id} className={`message ${message.role}-message ${message.loading ? "loading" : ""} ${message.error ? "error" : ""}`}>
      {message.role === "bot" && <img className="avatar" src="verdant-ai.svg" alt="Verdant AI Avatar" />}
      <div className="message-content">
        <p className="text">{message.content}</p>
        {message.role === "bot" && message.content && !message.loading && (
          <div className="message-actions">
            {isSpeechSupported() && (
              <button 
                className="speak-button" 
                onClick={handleSpeak}
                title={isPlaying ? "Stop speaking" : "Read aloud"}
              >
                {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            )}
            <button 
              className={`copy-button ${isCopied ? 'copied' : ''}`}
              onClick={handleCopy}
              title={isCopied ? "Copied!" : "Copy text"}
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button 
              className="download-button"
              onClick={handleDownloadPDF}
              title="Download as PDF"
            >
              <Download size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;

