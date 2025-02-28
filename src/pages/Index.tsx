
import React, { useEffect } from 'react';
import VoiceAssistant from '../components/VoiceAssistant';

const Index: React.FC = () => {
  // Add smooth page transition
  useEffect(() => {
    document.body.style.opacity = '0';
    
    // Trigger a reflow
    void document.body.offsetHeight;
    
    // Apply transition and set to fully visible
    document.body.style.transition = 'opacity 1s ease-in-out';
    document.body.style.opacity = '1';
    
    return () => {
      document.body.style.transition = '';
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-assistant-light to-white text-assistant-dark dark:from-assistant-dark dark:to-black dark:text-white transition-colors duration-500">
      <VoiceAssistant />
    </div>
  );
};

export default Index;
