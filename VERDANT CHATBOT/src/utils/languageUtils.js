// Language detection utility functions
export const detectLanguage = (text) => {
  // Enhanced language detection based on character patterns
  const hindiPattern = /[\u0900-\u097F]/;
  const bengaliPattern = /[\u0980-\u09FF]/;
  const gujaratiPattern = /[\u0A80-\u0AFF]/;
  const kannadaPattern = /[\u0C80-\u0CFF]/;
  const malayalamPattern = /[\u0D00-\u0D7F]/;
  const marathiPattern = /[\u0900-\u097F]/; // Same as Hindi/Devanagari
  const tamilPattern = /[\u0B80-\u0BFF]/;
  const teluguPattern = /[\u0C00-\u0C7F]/;
  const urduPattern = /[\u0600-\u06FF]/; // Arabic script
  
  if (hindiPattern.test(text) && !marathiPattern.test(text)) {
    return 'hi';
  } else if (bengaliPattern.test(text)) {
    return 'bn';
  } else if (gujaratiPattern.test(text)) {
    return 'gu';
  } else if (kannadaPattern.test(text)) {
    return 'kn';
  } else if (malayalamPattern.test(text)) {
    return 'ml';
  } else if (marathiPattern.test(text)) {
    // This is a simplified check - in practice, distinguishing Hindi from Marathi requires more sophisticated analysis
    return 'mr';
  } else if (tamilPattern.test(text)) {
    return 'ta';
  } else if (teluguPattern.test(text)) {
    return 'te';
  } else if (urduPattern.test(text)) {
    return 'ur';
  } else {
    return 'en';
  }
};

// Language code to voice mapping for Web Speech API
export const getVoiceForLanguage = (languageCode) => {
  const voiceMap = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'bn': 'bn-BD',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'mr': 'mr-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'ur': 'ur-PK'
  };
  return voiceMap[languageCode] || 'en-US';
};

// Text-to-Speech utility using Web Speech API
export const speakText = (text, languageCode = 'en') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voiceLang = getVoiceForLanguage(languageCode);
  
  // Set language
  utterance.lang = voiceLang;
  
  // Get available voices
  const voices = window.speechSynthesis.getVoices();
  
  // Find a voice that matches the language
  const matchingVoice = voices.find(voice => 
    voice.lang.startsWith(languageCode) || 
    voice.lang.startsWith(voiceLang) ||
    voice.lang === voiceLang
  );
  
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }
  
  // Set speech parameters
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  // Error handling
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event.error);
  };
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
};

// Load voices (needed for some browsers)
export const loadVoices = () => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
};

// Check if speech synthesis is supported
export const isSpeechSupported = () => {
  return 'speechSynthesis' in window;
};

