import { useState, useRef, useEffect } from 'react';
import './Chat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate support agent typing
    setIsTyping(true);
    
    // Simulate response after delay
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutomaticResponse(newMessage),
        sender: 'support',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Simple automatic responses based on keywords
  const getAutomaticResponse = (message: string) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return 'Hello! How can I assist you with your medical records today?';
    } else if (lowerMsg.includes('document') || lowerMsg.includes('upload')) {
      return 'You can upload your medical documents from the Home page. Just click the Upload button and select your files.';
    } else if (lowerMsg.includes('profile') || lowerMsg.includes('account')) {
      return 'You can view and edit your profile information from the Profile page. Your data is kept secure and private.';
    } else if (lowerMsg.includes('help') || lowerMsg.includes('support')) {
      return 'Our support team is available 24/7. You can also call our helpline at +91 1234567890 for immediate assistance.';
    } else if (lowerMsg.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "I'll connect you with a medical records specialist who can help you with that. In the meantime, is there anything else you'd like to know?";
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Support Chat</h1>
        <p>We're here to help with your medical records</p>
      </div>
      
      <div className="chat-box">
        <div className="messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="timestamp">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message support-message">
              <div className="message-content typing">
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
        
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat; 