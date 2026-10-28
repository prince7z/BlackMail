'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Icons } from '../Icons';

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  content: string;
}

interface InboxSectionProps {
  email: string;
  messages: Message[];
  onSelectMessage: (msg: Message) => void;
  onRefresh: () => void;
}

export default function InboxSection({ email, messages, onSelectMessage, onRefresh }: InboxSectionProps) {
  const barRef = useRef<HTMLDivElement>(null);

  // Restart the shrink animation on manual refresh
  const handleRefresh = () => {
    if (barRef.current) {
      barRef.current.style.animation = 'none';
      // force reflow
      void barRef.current.offsetWidth;
      barRef.current.style.animation = 'shrink 5s linear infinite';
    }
    onRefresh();
  };

  return (
    <section className="inbox-section">
      <div className="refresh-progress">
        <div
          ref={barRef}
          className="refresh-progress-bar"
          style={{
            animation: 'shrink 5s linear infinite',
            width: '95%',
            height: '3px',
            marginLeft: '20px',
            backgroundColor: 'var(--text-primary)',
            transformOrigin: 'left',
          }}
        />
      </div>

      <div className="inbox-card">
        <div className="inbox-header" style={{ display: 'flex' }}>
          <h3 className="inbox-title">Recent Mails</h3>
          <div className="refresh-button">
            <a onClick={handleRefresh} style={{ cursor: 'pointer', color: 'var(--text-primary)' }} aria-label="Refresh messages">
              <Icons.Refresh />
            </a>
          </div>
        </div>

        <div className="inbox-list">
          {messages.length > 0 ? (
            <div className="messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="message"
                  onClick={() => onSelectMessage(message)}
                >
                  <div className="message-header">
                    <div className="message-sender">
                      <div className="sender-avatar"><Icons.User /></div>
                      <span className="sender">{message.from}</span>
                    </div>
                    <span className="date">{message.date}</span>
                  </div>
                  <h3 className="subject">{message.subject}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-inbox">
              <div className="empty-inbox-icon"><Icons.Mail /></div>
              <p>Your inbox is empty</p>
              <p>Waiting for incoming emails</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
