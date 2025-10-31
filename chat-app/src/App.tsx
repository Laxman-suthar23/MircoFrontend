import { useState, useRef, useEffect } from 'react';
import './App.css';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  online: boolean;
  unread: number;
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '👩',
    lastMessage: 'See you tomorrow!',
    online: true,
    unread: 2,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: '👨',
    lastMessage: 'Thanks for the update',
    online: true,
    unread: 0,
  },
  {
    id: '3',
    name: 'Emily Davis',
    avatar: '👱‍♀️',
    lastMessage: 'Great work on the project',
    online: false,
    unread: 1,
  },
  {
    id: '4',
    name: 'James Wilson',
    avatar: '🧔',
    lastMessage: 'Let me know when you\'re free',
    online: true,
    unread: 0,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  '1': [
    { id: '1', text: 'Hey! How are you?', sender: 'contact', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', text: 'I\'m good! Working on the micro-frontend project', sender: 'user', timestamp: new Date(Date.now() - 3000000) },
    { id: '3', text: 'That sounds exciting! How\'s it going?', sender: 'contact', timestamp: new Date(Date.now() - 2400000) },
    { id: '4', text: 'Really well! Module Federation is amazing', sender: 'user', timestamp: new Date(Date.now() - 1800000) },
    { id: '5', text: 'See you tomorrow!', sender: 'contact', timestamp: new Date(Date.now() - 900000) },
  ],
  '2': [
    { id: '1', text: 'Did you check the latest PR?', sender: 'contact', timestamp: new Date(Date.now() - 7200000) },
    { id: '2', text: 'Yes, looks great! I approved it', sender: 'user', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', text: 'Thanks for the update', sender: 'contact', timestamp: new Date(Date.now() - 1800000) },
  ],
  '3': [
    { id: '1', text: 'The demo went really well!', sender: 'contact', timestamp: new Date(Date.now() - 5400000) },
    { id: '2', text: 'Great work on the project', sender: 'contact', timestamp: new Date(Date.now() - 3600000) },
  ],
  '4': [
    { id: '1', text: 'Are you available for a quick call?', sender: 'contact', timestamp: new Date(Date.now() - 1800000) },
    { id: '2', text: 'Let me know when you\'re free', sender: 'contact', timestamp: new Date(Date.now() - 900000) },
  ],
};

function ChatApp() {
  const [contacts] = useState<Contact[]>(mockContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages['1']);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setMessages(mockMessages[contact.id] || []);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages([...messages, message]);
      setNewMessage('');

      // Emit event for notification
      if ((window as any).eventBus) {
        (window as any).eventBus.emit('new_message', {
          from: selectedContact.name,
          text: newMessage,
        });
        (window as any).eventBus.emit('notification');
      }

      // Simulate response after 2 seconds
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! 👍',
          sender: 'contact',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-app">
      {/* Contacts Sidebar */}
      <div className="contacts-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
        </div>
        <div className="contacts-list">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
              onClick={() => handleContactClick(contact)}
            >
              <div className="contact-avatar">
                {contact.avatar}
                {contact.online && <span className="online-indicator"></span>}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-last-message">{contact.lastMessage}</div>
              </div>
              {contact.unread > 0 && (
                <div className="unread-badge">{contact.unread}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-contact-info">
                <span className="chat-avatar">{selectedContact.avatar}</span>
                <div>
                  <div className="chat-contact-name">{selectedContact.name}</div>
                  <div className="chat-contact-status">
                    {selectedContact.online ? '🟢 Online' : '⚫ Offline'}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'user' ? 'message-user' : 'message-contact'}`}
                >
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="send-button">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;