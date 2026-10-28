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
    <section className="email-section" aria-labelledby="email-section-title">
      <div className="email-card">
        <div className="email-intro">
          <span className="home-section-eyebrow">Private by default</span>
          <h1 id="email-section-title">Your inbox, without the noise.</h1>
          <p>Get a temporary address in seconds. No sign-up, no clutter in your personal inbox.</p>
        </div>

        <div className="email-display-area">
          {email ? (
            <>
              <label className="email-address-label" htmlFor="temporary-email-address">Your temporary address</label>
              <div className="email-input-wrapper">
                <input
                  id="temporary-email-address"
                  type="email"
                  value={email}
                  readOnly
                  className="email-input"
                  aria-label="Your temporary email address"
                />
                <div className="email-actions">
                  <button type="button" onClick={() => onCopy(email)} className="copy-btn" aria-label="Copy temporary email address">
                    <Icons.Copy />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <div className="email-status-row">
                <div className="timer-display" aria-label={`Address expires in ${formatTime(timeLeft)}`}>
                  <Icons.Timer />
                  <span>{formatTime(timeLeft)} remaining</span>
                </div>
                <span className="email-active-status"><span aria-hidden="true" /> Ready to receive mail</span>
              </div>

              <div className="action-buttons">
                <button type="button" onClick={onGenerate} className="change-btn">New address</button>
                <button type="button" onClick={onDelete} className="delete-btn">Delete</button>
                <button type="button" onClick={onExtend} className="extend-btn">Extend time</button>
                <button type="button" onClick={onBuy} className="buy-btn">Make it permanent</button>
              </div>

              {loading && (
                <div className="loading-indicator" role="status"><span>Generating a new address…</span></div>
              )}
            </>
          ) : (
            <div className="email-start-panel">
              <div className="email-start-copy">
                <span className="email-start-icon" aria-hidden="true"><Icons.Mail /></span>
                <div>
                  <strong>Ready when you are</strong>
                  <p>Your address is private and will expire automatically.</p>
                </div>
              </div>
              <button type="button" onClick={onGenerate} disabled={loading} className="generate-btn">
                {loading ? 'Generating…' : 'Generate temporary email'}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </div>
          )}

          {error && <p className="error-message" role="alert">{error}</p>}
        </div>
      </div>
    </section>
  );
}
