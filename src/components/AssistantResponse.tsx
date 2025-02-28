
import React, { useState, useEffect } from 'react';
import { delay } from '../utils/assistantUtils';

interface AssistantResponseProps {
  text: string;
  isTyping: boolean;
  typingSpeed?: number;
}

const AssistantResponse: React.FC<AssistantResponseProps> = ({ 
  text, 
  isTyping, 
  typingSpeed = 30 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const typeText = async () => {
      if (!text || !isTyping) return;
      
      setDisplayedText('');
      setTypingComplete(false);
      
      for (let i = 0; i < text.length; i++) {
        if (!isMounted) return;
        
        await delay(typingSpeed);
        setDisplayedText(prev => prev + text.charAt(i));
      }
      
      if (isMounted) {
        setTypingComplete(true);
      }
    };
    
    typeText();
    
    return () => {
      isMounted = false;
    };
  }, [text, isTyping, typingSpeed]);
  
  return (
    <div 
      className={`glass-morphism p-4 md:p-6 rounded-3xl transition-all duration-500 
                 animate-fade-in-up max-w-xl mx-auto
                 ${!typingComplete && isTyping ? 'opacity-90' : 'opacity-100'}`}
    >
      <p className="text-lg md:text-xl leading-relaxed">
        {displayedText}
        {isTyping && !typingComplete && (
          <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse-subtle" />
        )}
      </p>
    </div>
  );
};

export default AssistantResponse;
