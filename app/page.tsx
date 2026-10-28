'use client';

import { useEffect, useState, useCallback } from 'react';
import CardNav from './components/cardNav';
import type { CardNavItem } from './components/cardNav';
import { Toast } from './components/Toast';
import { BuyEmailDialog } from './components/BuyEmailDialog';
import EmailSection from './components/home/EmailSection';
import InboxSection from './components/home/InboxSection';
import MessageModal from './components/home/MessageModal';
import FaqSection from './components/home/FaqSection';
import BlogStrip from './components/home/BlogStrip';
import ContactSection from './components/home/ContactSection';
import Footer from './components/home/Footer';
import './styles/blackmail-theme.css';
import axios from 'axios';

interface Message {
  id: string;
  from: string;
  subject: string;
  date: string;
  body: string;
  content: string;
}

const navItems: CardNavItem[] = [
  {
    label: 'Features',
    bgColor: 'var(--bg-primary)',
    textColor: 'var(--text-primary)',
    links: [
      { label: 'Temporary Email',    href: '/policy', ariaLabel: 'Learn about temporary email' },
      { label: 'Auto Delete',        href: '/policy', ariaLabel: 'Auto delete feature' },
      { label: 'Privacy Protection', href: '/policy', ariaLabel: 'Privacy protection' },
      { label: 'API Access',         href: '/policy', ariaLabel: 'API access' },
    ],
  },
  {
    label: 'Support',
    bgColor: 'var(--bg-primary)',
    textColor: 'var(--text-primary)',
    links: [
      { label: 'Help Center', href: '/policy',                           ariaLabel: 'Visit help center' },
      { label: 'Contact Us',  href: 'https://linkedin.com/in/Prince7z',  ariaLabel: 'Contact support' },
      { label: 'FAQ',         href: '#FAQ',                              ariaLabel: 'Frequently asked questions' },
      { label: 'Live Chat',   href: 'https://linkedin.com/in/Prince7z',  ariaLabel: 'Start live chat' },
    ],
  },
  {
    label: 'Company',
    bgColor: 'var(--bg-primary)',
    textColor: 'var(--text-primary)',
    links: [
      { label: 'About Us',       href: '/policy', ariaLabel: 'About BlackMail' },
      { label: 'Privacy Policy', href: '/policy', ariaLabel: 'Privacy policy' },
      { label: 'Terms',          href: '/policy', ariaLabel: 'Terms of service' },
      { label: 'Blog',           href: '/blog',   ariaLabel: 'Visit our blog' },
    ],
  },
];

export default function Home() {
  // ── Email state ──────────────────────────────────────────────
  const [email, setEmail]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [messages, setMessages]         = useState<Message[]>([]);
  const [selectedMessage, setSelected]  = useState<Message | null>(null);
  const [timeLeft, setTimeLeft]         = useState(600);

  // ── Permanent email dialog ───────────────────────────────────
  const [pass, setPass]                         = useState('');
  const [permId, setPermId]                     = useState('');
  const [permToken, setPermToken]               = useState('');
  const [isBuyDialogOpen, setIsBuyDialogOpen]   = useState(false);

  // ── Toast ────────────────────────────────────────────────────
  const [showToast, setShowToast]   = useState(false);
  const [toastMsg, setToastMsg]     = useState('');

  const showToastMessage = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ── Timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (!email) return;
    if (timeLeft <= 0) { deleteEmail(); return; }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, email]);

  // ── Message polling ──────────────────────────────────────────
  const checkMessages = useCallback(async () => {
    if (!email) return;
    try {
      const res = await axios.post('/api/temp', { token: localStorage.getItem('Token') });
      setMessages(res.data);
    } catch { /* silent */ }
  }, [email]);

  useEffect(() => {
    if (!email) return;
    const iv = setInterval(checkMessages, 5000);
    return () => clearInterval(iv);
  }, [email, checkMessages]);

  // ── Actions ──────────────────────────────────────────────────
  const generateEmail = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/temp');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.setItem('Token', data.token);
      localStorage.setItem('id',    data.id);
      setEmail(data.email);
      setTimeLeft(600);
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async () => {
    await axios.delete('/api/temp', { data: { id: localStorage.getItem('id') } });
    setEmail(''); setMessages([]); setTimeLeft(600); setSelected(null);
  };

  const extendTime = () => {
    if (timeLeft < 1200) { setTimeLeft((p) => p + 600); showToastMessage('Time extended by 10 minutes'); }
    else showToastMessage('Maximum time limit reached');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToastMessage('Copied to clipboard!');
  };

  const buyEmail = async () => {
    if (!email) { showToastMessage('Please generate an email first!'); return; }
    try {
      const res = await axios.put('/api/temp', { email, action: 'buy' });
      if (res.data.error) { showToastMessage(res.data.error); return; }
      const d = res.data.ownResult;
      setPass(d.password); setPermId(d.id); setPermToken(d.token);
      showToastMessage('Permanent email activated - FREE!');
      setIsBuyDialogOpen(true);
    } catch {
      showToastMessage('Failed to get permanent email. Please try again.');
    }
  };

  return (
    <div className="app-container">
      {/* Nav */}
      <div className="nav-wrapper">
        <CardNav
          logo="/logo_Nav.png"
          logoAlt="BlackMail Logo"
          items={navItems}
          className="main-nav"
          baseColor="var(--bg-primary)"
          menuColor="var(--bg-primary)"
          buttonBgColor="var(--text-primary)"
          buttonTextColor="var(--bg-primary)"
        />
      </div>

      <main className="main-content">
        {/* Email generator */}
        <EmailSection
          email={email}
          loading={loading}
          error={error}
          timeLeft={timeLeft}
          onGenerate={generateEmail}
          onDelete={deleteEmail}
          onCopy={copyToClipboard}
          onExtend={extendTime}
          onBuy={buyEmail}
        />

        {/* Inbox */}
        <InboxSection
          email={email}
          messages={messages}
          onSelectMessage={setSelected}
          onRefresh={checkMessages}
        />

        {/* Message modal */}
        {selectedMessage && (
          <MessageModal message={selectedMessage} onClose={() => setSelected(null)} />
        )}

        {/* FAQ — full width */}
        <FaqSection />

        {/* Blog strip — discover more after the FAQs */}
        <BlogStrip />

        {/* Contact — full width */}
        <ContactSection onToast={showToastMessage} />

      </main>

      <Footer />

      <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />

      <BuyEmailDialog
        isOpen={isBuyDialogOpen}
        onClose={() => setIsBuyDialogOpen(false)}
        email={email}
        password={pass}
        id={permId}
        token={permToken}
      />
    </div>
  );
}