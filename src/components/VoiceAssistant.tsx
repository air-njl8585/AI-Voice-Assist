
import React, { useState, useCallback, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import VoiceVisualizer from './VoiceVisualizer';
import LoadingIndicator from './LoadingIndicator';
import AssistantResponse from './AssistantResponse';
import { processUserInput, delay } from '../utils/assistantUtils';

const VoiceAssistant: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<Array<{text: string, isUser: boolean}>>([]);
  
  // Initialize speech recognition
  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport
  } = useSpeechRecognition({
    onResult: async (result) => {
      setUserInput(result);
    },
    onEnd: () => {
      // Only process if we have input
      if (userInput.trim()) {
        handleProcessInput();
      }
    }
  });
  
  // Initialize speech synthesis
  const {
    speak,
    cancel,
    speaking,
    hasSynthesisSupport
  } = useSpeechSynthesis({
    onEnd: () => {
      // Nothing to do when speech ends for now
    }
  });
  
  useEffect(() => {
    // Update the input if text changes from recognition
    if (text) {
      setUserInput(text);
    }
  }, [text]);
  
  const handleProcessInput = useCallback(async () => {
    if (!userInput.trim()) return;
    
    // Stop listening while processing
    stopListening();
    
    // Add user input to conversation
    setConversation(prev => [...prev, { text: userInput, isUser: true }]);
    
    // Start processing state
    setIsProcessing(true);
    
    // Simulate processing delay for natural interaction
    await delay(800);
    
    // Process the input
    const response = processUserInput(userInput);
    
    // Add response to conversation
    setConversation(prev => [...prev, { text: response, isUser: false }]);
    
    // Set the response and begin typing animation
    setAssistantResponse(response);
    setIsTyping(true);
    setIsProcessing(false);
    
    // Speak the response after a small delay
    await delay(500);
    if (hasSynthesisSupport) {
      speak(response);
    }
    
    // Clear the user input
    setUserInput('');
  }, [userInput, hasSynthesisSupport, speak, stopListening]);
  
  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      // Cancel any ongoing speech before starting to listen
      if (speaking) {
        cancel();
      }
      startListening();
    }
  }, [isListening, speaking, startListening, stopListening, cancel]);
  
  const handleTextSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleProcessInput();
    }
  }, [userInput, handleProcessInput]);
  
  return (
    <div className="assistant-container min-h-screen flex flex-col justify-between">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Voice Assistant</h1>
        <p className="text-opacity-80 text-lg">Ask me anything or give me a command</p>
      </div>
      
      {/* Conversation Area */}
      <div className="flex-1 mb-8 flex flex-col justify-end space-y-6">
        {conversation.map((item, index) => (
          <div 
            key={index} 
            className={`flex ${item.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div 
              className={`${
                item.isUser 
                  ? 'bg-assistant-primary text-white rounded-tr-none' 
                  : 'glass-morphism rounded-tl-none'
              } px-4 md:px-6 py-3 md:py-4 rounded-2xl max-w-xs md:max-w-md`}
            >
              <p>{item.text}</p>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-morphism px-6 py-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
              <LoadingIndicator size="sm" />
              <span>Processing...</span>
            </div>
          </div>
        )}
        
        {assistantResponse && isTyping && !isProcessing && (
          <div className="flex justify-start animate-fade-in">
            <AssistantResponse 
              text={assistantResponse} 
              isTyping={isTyping} 
            />
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="glass-morphism p-4 rounded-2xl">
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-lg"
            disabled={isListening || isProcessing}
          />
          
          <button
            type="button"
            onClick={handleToggleListening}
            disabled={!hasRecognitionSupport || isProcessing}
            className={`p-3 rounded-full transition-all duration-300
                       ${isListening 
                         ? 'bg-assistant-accent text-white shadow-lg' 
                         : 'bg-white bg-opacity-10 text-assistant-primary'
                       } hover:bg-opacity-90 active:scale-95 focus:outline-none`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <div className="relative h-6 w-6 flex items-center justify-center">
              {isListening && (
                <div className="absolute inset-0 rounded-full animate-ripple bg-assistant-accent opacity-30" />
              )}
              <VoiceVisualizer isActive={isListening} color={isListening ? 'white' : 'currentColor'} />
            </div>
          </button>
          
          <button
            type="submit"
            disabled={!userInput.trim() || isProcessing}
            className="p-3 bg-assistant-primary text-white rounded-full hover:bg-opacity-90 
                     transition-all duration-300 active:scale-95 focus:outline-none"
            aria-label="Send message"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-5 w-5"
            >
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
          </button>
        </form>
      </div>
      
      {/* Status indicator */}
      <div className="mt-4 text-center opacity-70 text-sm">
        {!hasRecognitionSupport && (
          <p>Speech recognition is not supported in your browser.</p>
        )}
        {!hasSynthesisSupport && (
          <p>Speech synthesis is not supported in your browser.</p>
        )}
        {isListening && (
          <p className="text-assistant-primary font-medium">Listening for your voice...</p>
        )}
        {speaking && (
          <p className="text-assistant-accent font-medium">Speaking response...</p>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
