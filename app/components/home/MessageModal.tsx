'use client';

import { Icons } from '../Icons';

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  content: string;
}

interface MessageModalProps {
  message: Message;
  onClose: () => void;
}

export default function MessageModal({ message, onClose }: MessageModalProps) {
  return (
    <div className="message-modal-overlay" onClick={onClose}>
      <div className="message-modal" onClick={(e) => e.stopPropagation()}>
        <div className="message-modal-header">
          <button className="back-btn" onClick={onClose}>← BACK TO LIST</button>
          <div className="message-modal-actions">
            <button className="message-action-btn" onClick={onClose}>Delete</button>
            <button className="message-action-btn">Source</button>
          </div>
        </div>

        <div className="message-modal-content">
          <div className="message-sender-info">
            <div className="sender-avatar-large"><Icons.User /></div>
            <div className="sender-details">
              <div className="sender-email">{message.from}</div>
              <div className="message-date-full">Date: {message.date}</div>
            </div>
          </div>

          <div className="message-subject-full">
            <strong>Subject:</strong> {message.subject}
          </div>

          <div className="message-content">
            <div className="message-subject-full">
              <strong>Body:</strong>
              <div
                className="message-body"
                dangerouslySetInnerHTML={{ __html: message.body }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
