import { useEffect, useRef } from 'react';

export const useScrollToBottom = (dependencies = [], behavior = 'smooth') => {
  const elementRef = useRef(null);

  const scrollToBottom = () => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ 
        behavior, 
        block: 'end' 
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, dependencies);

  return { elementRef, scrollToBottom };
};

// Alternative: Auto-scroll container
export const useAutoScroll = (enabled = true) => {
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (enabled) {
      scrollToBottom();
    }
  }, [enabled]);

  return { containerRef, scrollToBottom };
};
