// Speech recognition utility functions
export const isSpeechRecognitionSupported = () => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const createSpeechRecognition = (language = 'en-US') => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language;
  
  return recognition;
};

export const getLanguageCode = (language) => {
  const languageMap = {
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
  return languageMap[language] || 'en-US';
};

// Text-to-Speech utility functions
export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
};

export const getAvailableVoices = () => {
  if (!isSpeechSynthesisSupported()) {
    return [];
  }
  return speechSynthesis.getVoices();
};

export const findBestVoice = (language) => {
  const voices = getAvailableVoices();
  const langCode = getLanguageCode(language);
  
  // First try to find exact match
  let voice = voices.find(v => v.lang === langCode);
  
  // If no exact match, try language prefix (e.g., 'hi' for 'hi-IN')
  if (!voice) {
    const langPrefix = langCode.split('-')[0];
    voice = voices.find(v => v.lang.startsWith(langPrefix));
  }
  
  // Fallback to default voice
  if (!voice) {
    voice = voices.find(v => v.default) || voices[0];
  }
  
  return voice;
};

export const speakText = (text, language = 'en', onStart = null, onEnd = null, onError = null) => {
  if (!isSpeechSynthesisSupported()) {
    if (onError) onError(new Error('Speech synthesis not supported'));
    return null;
  }

  // Stop any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = findBestVoice(language);
  
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = getLanguageCode(language);
  }
  
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  speechSynthesis.speak(utterance);
  return utterance;
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    speechSynthesis.cancel();
  }
};

export const isSpeaking = () => {
  return isSpeechSynthesisSupported() && speechSynthesis.speaking;
};

// Load voices (some browsers load voices asynchronously)
export const loadVoices = () => {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve([]);
      return;
    }

    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const voicesChangedHandler = () => {
      voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
        resolve(voices);
      }
    };

    speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
    
    // Fallback timeout
    setTimeout(() => {
      speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
      resolve(speechSynthesis.getVoices());
    }, 3000);
  });
};

