'use client';

import { Icons } from '../Icons';

interface EmailSectionProps {
  email: string;
  loading: boolean;
  error: string;
  timeLeft: number;
  onGenerate: () => void;
  onDelete: () => void;
  onCopy: (text: string) => void;
  onExtend: () => void;
  onBuy: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function EmailSection({
  email, loading, error, timeLeft,
  onGenerate, onDelete, onCopy, onExtend, onBuy,
}: EmailSectionProps) {
  return (
    <section className="email-section">
      <div className="email-card">
        <h2>Your Temporary Email Address</h2>

        <div className="email-display-area">
          {email ? (
            <>
              <div className="email-input-wrapper">
                <input type="text" value={email} readOnly className="email-input" />
                <div className="email-actions">
                  <button onClick={() => onCopy(email)} className="copy-btn" aria-label="Copy email">
                    <Icons.Copy />
                  </button>
                </div>
              </div>

              <div className="timer-display">
                <Icons.Timer />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <div className="action-buttons">
                <button onClick={onGenerate} className="change-btn">Change</button>
                <button onClick={onDelete} className="delete-btn">Delete</button>
                <button onClick={onExtend} className="extend-btn">Extend Time</button>
                <button onClick={onBuy} className="buy-btn">Get Permanent Email</button>
              </div>

              {loading && (
                <div className="loading-indicator"><span>Loading...</span></div>
              )}
            </>
          ) : (
            <button onClick={onGenerate} disabled={loading} className="generate-btn">
              {loading ? 'Generating…' : 'Generate New Email'}
            </button>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </section>
  );
}
