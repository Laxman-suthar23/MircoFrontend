import React, { useState } from 'react';
import './App.css';

// Types
interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  avatar: string;
}

// Mock data
const mockEmails: Email[] = [
  {
    id: '1',
    from: 'Sarah Johnson',
    subject: 'Q4 Project Update',
    preview: 'Hey team, I wanted to share the latest updates on our Q4 project...',
    body: 'Hey team, I wanted to share the latest updates on our Q4 project. We\'ve made significant progress on the micro-frontend architecture and the results are looking great! The modular approach is really paying off in terms of development speed and maintainability. Let me know if you have any questions.',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    starred: true,
    avatar: '👩',
  },
  {
    id: '2',
    from: 'Mike Chen',
    subject: 'Code Review Request',
    preview: 'Hi, could you please review my PR for the new authentication module?',
    body: 'Hi, could you please review my PR for the new authentication module? I\'ve implemented the OAuth2 flow and added comprehensive test coverage. The PR is ready for your feedback. Thanks!',
    timestamp: new Date(Date.now() - 7200000),
    read: false,
    starred: false,
    avatar: '👨',
  },
  {
    id: '3',
    from: 'Emily Davis',
    subject: 'Team Meeting Tomorrow',
    preview: 'Just a reminder about our team sync tomorrow at 10 AM...',
    body: 'Just a reminder about our team sync tomorrow at 10 AM. We\'ll be discussing the sprint goals and reviewing the roadmap. Please come prepared with your updates. See you there!',
    timestamp: new Date(Date.now() - 10800000),
    read: true,
    starred: false,
    avatar: '👱‍♀️',
  },
  {
    id: '4',
    from: 'James Wilson',
    subject: 'Design System Documentation',
    preview: 'I\'ve updated the design system docs with the new component guidelines...',
    body: 'I\'ve updated the design system docs with the new component guidelines. All the shared components are now properly documented with examples and usage instructions. Check it out when you get a chance!',
    timestamp: new Date(Date.now() - 14400000),
    read: true,
    starred: true,
    avatar: '🧔',
  },
  {
    id: '5',
    from: 'Lisa Anderson',
    subject: 'Performance Optimization Results',
    preview: 'Great news! The recent optimizations have improved load times by 40%...',
    body: 'Great news! The recent optimizations have improved load times by 40%. The lazy loading implementation and code splitting are working perfectly. Users are reporting a much smoother experience. Well done team!',
    timestamp: new Date(Date.now() - 18000000),
    read: true,
    starred: false,
    avatar: '👩‍💼',
  },
  {
    id: '6',
    from: 'David Kim',
    subject: 'Bug Report - Chat Module',
    preview: 'Found a minor issue in the chat module that needs attention...',
    body: 'Found a minor issue in the chat module that needs attention. Sometimes messages don\'t scroll to bottom automatically. I\'ve created a ticket with reproduction steps. Let me know if you need more info.',
    timestamp: new Date(Date.now() - 21600000),
    read: false,
    starred: false,
    avatar: '👨‍💻',
  },
];

type FilterType = 'all' | 'unread' | 'starred';

function EmailApp() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: '',
  });

  const filteredEmails = emails.filter(email => {
    if (filter === 'unread') return !email.read;
    if (filter === 'starred') return email.starred;
    return true;
  });

  const unreadCount = emails.filter(e => !e.read).length;

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    // Mark as read
    setEmails(emails.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ));
  };

  const handleStarToggle = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.map(email =>
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail({ ...selectedEmail, starred: !selectedEmail.starred });
    }
  };

  const handleCompose = () => {
    setShowCompose(true);
    setSelectedEmail(null);
  };

  const handleSendEmail = () => {
    if (composeData.to && composeData.subject && composeData.body) {
      // Emit event for notification
      if ((window as any).eventBus) {
        (window as any).eventBus.emit('new_email', {
          to: composeData.to,
          subject: composeData.subject,
        });
        (window as any).eventBus.emit('notification');
      }

      alert('Email sent successfully!');
      setShowCompose(false);
      setComposeData({ to: '', subject: '', body: '' });
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="email-app">
      {/* Sidebar */}
      <div className="email-sidebar">
        <button className="compose-button" onClick={handleCompose}>
          ✏️ Compose
        </button>

        <div className="email-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            📥 All Mail
            <span className="count-badge">{emails.length}</span>
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            📬 Unread
            {unreadCount > 0 && <span className="count-badge">{unreadCount}</span>}
          </button>
          <button
            className={`filter-btn ${filter === 'starred' ? 'active' : ''}`}
            onClick={() => setFilter('starred')}
          >
            ⭐ Starred
            <span className="count-badge">{emails.filter(e => e.starred).length}</span>
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="email-list">
        <div className="list-header">
          <h2>Inbox</h2>
          <span className="email-count">{filteredEmails.length} emails</span>
        </div>
        <div className="emails-container">
          {filteredEmails.map(email => (
            <div
              key={email.id}
              className={`email-item ${!email.read ? 'unread' : ''} ${
                selectedEmail?.id === email.id ? 'selected' : ''
              }`}
              onClick={() => handleEmailClick(email)}
            >
              <div className="email-item-header">
                <span className="email-avatar">{email.avatar}</span>
                <div className="email-item-info">
                  <div className="email-from">{email.from}</div>
                  <div className="email-time">{formatTime(email.timestamp)}</div>
                </div>
                <button
                  className={`star-btn ${email.starred ? 'starred' : ''}`}
                  onClick={(e) => handleStarToggle(email.id, e)}
                >
                  {email.starred ? '⭐' : '☆'}
                </button>
              </div>
              <div className="email-subject">{email.subject}</div>
              <div className="email-preview">{email.preview}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Detail / Compose */}
      <div className="email-detail">
        {showCompose ? (
          <div className="compose-area">
            <div className="compose-header">
              <h2>New Message</h2>
              <button className="close-btn" onClick={() => setShowCompose(false)}>
                ✕
              </button>
            </div>
            <div className="compose-form">
              <input
                type="text"
                placeholder="To"
                value={composeData.to}
                onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                className="compose-input"
              />
              <input
                type="text"
                placeholder="Subject"
                value={composeData.subject}
                onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                className="compose-input"
              />
              <textarea
                placeholder="Write your message..."
                value={composeData.body}
                onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                className="compose-textarea"
              />
              <button className="send-email-btn" onClick={handleSendEmail}>
                Send Email
              </button>
            </div>
          </div>
        ) : selectedEmail ? (
          <div className="detail-area">
            <div className="detail-header">
              <div className="detail-from">
                <span className="detail-avatar">{selectedEmail.avatar}</span>
                <div>
                  <div className="detail-from-name">{selectedEmail.from}</div>
                  <div className="detail-time">{formatTime(selectedEmail.timestamp)}</div>
                </div>
              </div>
              <button
                className={`star-btn-large ${selectedEmail.starred ? 'starred' : ''}`}
                onClick={(e) => handleStarToggle(selectedEmail.id, e)}
              >
                {selectedEmail.starred ? '⭐' : '☆'}
              </button>
            </div>
            <div className="detail-subject">{selectedEmail.subject}</div>
            <div className="detail-body">{selectedEmail.body}</div>
          </div>
        ) : (
          <div className="no-email-selected">
            <div className="empty-state">
              <div className="empty-icon">📧</div>
              <p>Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailApp;