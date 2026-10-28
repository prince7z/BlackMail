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
    <section className="contact-section">
      <div className="contact-card">
        <h2>Get in Touch</h2>
        <p className="contact-description">
          Have questions about BlackMail? Need support? We're here to help!
        </p>

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
          </button>
        </form>

        <div className="contact-info">
          <div className="contact-item">
            <Icons.Mail />
            <span>princesahu17125@gmail.com</span>
          </div>
          <div className="contact-item">
            <Icons.MessageCircle />
            <span>Live Chat Available 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
