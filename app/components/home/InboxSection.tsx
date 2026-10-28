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
    <section className="inbox-section" aria-labelledby="inbox-section-title">
      <div className="inbox-card">
        <div className="refresh-progress" aria-hidden="true">
        <div
          ref={barRef}
          className="refresh-progress-bar"
        />
        </div>

        <div className="inbox-header">
          <div>
            <span className="home-section-eyebrow">Your private inbox</span>
            <h2 className="inbox-title" id="inbox-section-title">Recent messages</h2>
          </div>
          <div className="inbox-header-actions">
            <span className="inbox-status">{messages.length > 0 ? `${messages.length} ${messages.length === 1 ? 'message' : 'messages'}` : 'Ready to receive'}</span>
            <button type="button" className="refresh-button" onClick={handleRefresh} aria-label="Refresh inbox">
              <Icons.Refresh />
            </button>
          </div>
        </div>

        <div className="inbox-list" aria-live="polite">
          {messages.length > 0 ? (
            <div className="messages">
              {messages.map((message) => (
                <button
                  type="button"
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
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-inbox">
              <div className="empty-inbox-icon" aria-hidden="true"><Icons.Mail /></div>
              <p className="empty-inbox-title">Your inbox is ready</p>
              <p>Messages sent to your address will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
