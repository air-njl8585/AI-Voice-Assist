
import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  color?: string;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ 
  isActive, 
  color = 'currentColor' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Clear any existing bars
    container.innerHTML = '';
    
    // Create 5 bars for visualization
    const bars = Array.from({ length: 5 }, (_, i) => {
      const bar = document.createElement('div');
      bar.className = 'visualizer-bar';
      bar.style.backgroundColor = color;
      bar.style.height = '4px';
      bar.style.transition = 'height 0.2s ease';
      container.appendChild(bar);
      return bar;
    });
    
    if (isActive) {
      // Animate the bars when active
      const animateBars = () => {
        bars.forEach((bar) => {
          const randomHeight = isActive ? Math.floor(Math.random() * 24) + 8 : 4;
          bar.style.height = `${randomHeight}px`;
        });
        
        animationRef.current.push(
          window.setTimeout(animateBars, Math.random() * 100 + 50)
        );
      };
      
      animateBars();
    } else {
      // Reset to minimal height when inactive
      bars.forEach((bar) => {
        bar.style.height = '4px';
      });
    }
    
    return () => {
      // Clear all timeouts on cleanup
      animationRef.current.forEach(clearTimeout);
      animationRef.current = [];
    };
  }, [isActive, color]);
  
  return (
    <div 
      ref={containerRef} 
      className="visualizer-container"
      aria-hidden="true"
    />
  );
};

export default VoiceVisualizer;
