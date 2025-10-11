/**
 * TravelChat Component
 *
 * A floating chat interface that connects to an AI travel assistant powered by Ollama.
 * Features:
 * - Real-time messaging with AI
 * - Service health monitoring
 * - Auto-scroll to latest messages
 * - Clean, modern UI with animations
 */

import { useState, useRef, useEffect } from 'react';

/**
 * Interface representing a single chat message
 */
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function TravelChat() {
  // Chat messages state - initialized with welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi! I'm your travel assistant. Ask me anything about travel destinations, tips, or recommendations!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  // Input field state
  const [input, setInput] = useState('');

  // Loading state while waiting for AI response
  const [isLoading, setIsLoading] = useState(false);

  // Controls chat window visibility
  const [isOpen, setIsOpen] = useState(false);

  // Tracks Ollama service availability status
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Reference for auto-scrolling to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Smoothly scrolls the chat to the bottom to show latest messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check Ollama service status on component mount
  useEffect(() => {
    checkOllamaStatus();
  }, []);

  /**
   * Checks if the Ollama service is available by calling the health endpoint
   * Updates the status indicator in the chat header
   */
  const checkOllamaStatus = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/chat/health`);
      const data = await response.json();
      setOllamaStatus(data.available ? 'available' : 'unavailable');
    } catch {
      setOllamaStatus('unavailable');
    }
  };

  /**
   * Handles sending a message to the AI
   * - Adds user message to chat
   * - Calls backend API
   * - Displays AI response or error message
   */
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent sending empty messages or while loading
    if (!input.trim() || isLoading) return;

    // Create and display user message immediately
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to backend API (URL from environment variable)
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Display AI response
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Display error message to user
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I could not process your request. Please make sure Ollama is running.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clears all messages and resets to initial welcome message
   */
  const clearChat = () => {
    setMessages([
      {
        id: 0,
        text: "Hi! I'm your travel assistant. Ask me anything about travel destinations, tips, or recommendations!",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      <button 
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Travel Assistant"
      >
        ✈️
      </button>

      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <div>
              <h3>🌍 Travel Assistant</h3>
              <span className={`status-indicator ${ollamaStatus}`}>
                {ollamaStatus === 'checking' && '⏳ Checking...'}
                {ollamaStatus === 'available' && '🟢 Online'}
                {ollamaStatus === 'unavailable' && '🔴 Offline'}
              </span>
            </div>
            <div className="chat-header-actions">
              <button onClick={clearChat} className="clear-btn" title="Clear chat">
                🗑️
              </button>
              <button onClick={() => setIsOpen(false)} className="close-btn" title="Close">
                ✕
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-avatar">
                  {msg.sender === 'ai' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about travel destinations..."
              disabled={isLoading || ollamaStatus === 'unavailable'}
              className="chat-input"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim() || ollamaStatus === 'unavailable'}
              className="send-btn"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </form>

          {ollamaStatus === 'unavailable' && (
            <div className="ollama-warning">
              ⚠️ Ollama is not running. Start it with: <code>ollama serve</code>
            </div>
          )}
        </div>
      )}
    </>
  );
}