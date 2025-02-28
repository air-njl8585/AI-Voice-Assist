
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (result: string) => void;
  onEnd?: () => void;
  language?: string;
}

interface UseSpeechRecognitionReturn {
  text: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
}

const useSpeechRecognition = ({
  onResult,
  onEnd,
  language = 'en-US'
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn => {
  const [text, setText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState<boolean>(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;
      setHasRecognitionSupport(true);
    }
  }, [language]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    const handleResult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setText(transcript);
      
      if (event.results[0].isFinal && onResult) {
        onResult(transcript);
      }
    };

    const handleEnd = () => {
      setIsListening(false);
      if (onEnd) onEnd();
    };

    recognitionRef.current.onresult = handleResult;
    recognitionRef.current.onend = handleEnd;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
      }
    };
  }, [onResult, onEnd]);

  const startListening = useCallback(() => {
    setText('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport
  };
};

export default useSpeechRecognition;

// Add TypeScript definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
