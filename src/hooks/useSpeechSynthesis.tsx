
import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisProps {
  onEnd?: () => void;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  cancel: () => void;
  speaking: boolean;
  voices: SpeechSynthesisVoice[];
  hasSynthesisSupport: boolean;
}

const useSpeechSynthesis = ({
  onEnd,
  rate = 1,
  pitch = 1,
  volume = 1,
  voice = null
}: UseSpeechSynthesisProps = {}): UseSpeechSynthesisReturn => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [hasSynthesisSupport, setHasSynthesisSupport] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSynthesisSupport(true);
      
      // Get the list of voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!hasSynthesisSupport) return;
      
      // Cancel any ongoing speech
      cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      // Use the specified voice or default to the first available voice
      if (voice) {
        utterance.voice = voice;
      } else if (voices.length > 0) {
        // Try to find a good quality English voice
        const preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Premium'))
        );
        
        utterance.voice = preferredVoice || voices[0];
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        setSpeaking(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    },
    [hasSynthesisSupport, rate, pitch, volume, voice, voices, onEnd]
  );

  const cancel = useCallback(() => {
    if (hasSynthesisSupport) {
      setSpeaking(false);
      window.speechSynthesis.cancel();
    }
  }, [hasSynthesisSupport]);

  return {
    speak,
    cancel,
    speaking,
    voices,
    hasSynthesisSupport
  };
};

export default useSpeechSynthesis;
