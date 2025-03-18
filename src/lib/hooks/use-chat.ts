import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You may need to install this package

// Define the Message type
export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useChat(agentType: string, startFresh = false) {
  // Store messages in localStorage with agentType as key prefix
  const localStorageKey = `chat-history-${agentType}`;
  
  // State for messages and loading
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load messages from localStorage on component mount (or clear them if startFresh is true)
  useEffect(() => {
    // Only run in browser context
    if (typeof window !== 'undefined') {
      if (startFresh) {
        localStorage.removeItem(localStorageKey);
        setMessages([]);
      } else {
        try {
          const stored = localStorage.getItem(localStorageKey);
          if (stored) {
            setMessages(JSON.parse(stored));
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error('Failed to load messages from localStorage:', error);
          setMessages([]);
        }
      }
    }
  }, [agentType, localStorageKey, startFresh]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    // Only run in browser context
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(localStorageKey, JSON.stringify(messages));
    }
  }, [messages, localStorageKey]);
  
  // Add a message to the chat
  const addMessage = (message: Message) => {
    const messageWithId = {
      ...message,
      id: message.id || uuidv4(),
    };
    
    setMessages(prevMessages => [...prevMessages, messageWithId]);
  };
  
  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(localStorageKey);
    }
  };
  
  return {
    messages,
    addMessage,
    clearMessages,
    isLoading,
    setLoading: setIsLoading,
  };
}