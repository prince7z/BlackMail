'use client';

import { useState } from 'react';
import { Icons } from '../Icons';
import axios from 'axios';

interface ContactSectionProps {
  onToast: (msg: string) => void;
}

export default function ContactSection({ onToast }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post('/api/contact', {
        username: name,
        usermail: email,
        usersub: subject,
        contactMessage: message,
      });
      if (res.status === 200) {
        onToast('Message sent successfully!');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      }
    } catch {
      onToast('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-section" aria-labelledby="contact-section-title">
      <div className="contact-card">
        <div className="contact-intro">
          <span className="home-section-eyebrow">We’re here to help</span>
          <h2 id="contact-section-title">Let’s talk.</h2>
          <p className="contact-description">
            Questions, feedback, or need a hand? Send us a note and we’ll get back to you.
          </p>

          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-item-icon"><Icons.Mail /></span>
              <span>princesahu17125@gmail.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-item-icon"><Icons.MessageCircle /></span>
              <span>Support is available 24/7</span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject">Subject</label>
            <input id="contact-subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>

          <button type="submit" className="contact-submit-btn" disabled={sending}>
            {sending ? 'Sending…' : 'Send Message'}
            {!sending && <span aria-hidden="true">→</span>}
          </button>
        </form>
      </div>
    </section>
  );
}
