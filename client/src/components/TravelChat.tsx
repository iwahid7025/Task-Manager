import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function TravelChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi! I'm your travel assistant. Ask me anything about travel destinations, tips, or recommendations!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkOllamaStatus();
  }, []);

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

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
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
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