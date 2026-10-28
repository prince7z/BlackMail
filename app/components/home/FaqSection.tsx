'use client';

import { useState } from 'react';

interface FAQ { question: string; answer: string; }

const faqs: FAQ[] = [
  {
    question: 'What is BlackMail and how does it work?',
    answer: 'BlackMail is a fast and secure disposable temporary email service that instantly generates a temporary email address for you—no sign-up required. Use it for registrations, verifications, or testing while keeping your real inbox spam-free.',
  },
  {
    question: 'How is BlackMail different from regular email services?',
    answer: 'BlackMail provides disposable email addresses that automatically expire, protecting your privacy. Unlike regular email, no registration is required and addresses are temporary.',
  },
  {
    question: 'Is BlackMail anonymous and secure?',
    answer: "Yes, BlackMail is completely anonymous. We don't collect personal information and all emails are automatically deleted after expiration.",
  },
  {
    question: 'How long do temporary emails last?',
    answer: 'Temporary emails last 10 minutes by default. You can extend this up to 20 minutes or delete them earlier at any time.',
  },
  {
    question: 'Can I use BlackMail for important accounts?',
    answer: 'We recommend BlackMail only for temporary purposes like testing or avoiding spam. For important accounts, use a permanent email service.',
  },
];

export default function FaqSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="faq-column" id="FAQ">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, i) => (
        <div key={i} className={`faq-item ${active === i ? 'active' : ''}`}>
          <button
            className="faq-question"
            onClick={() => setActive(active === i ? null : i)}
            aria-expanded={active === i}
          >
            <span>{faq.question}</span>
            <span>{active === i ? '▼' : '▶'}</span>
          </button>
          <p className="faq-answer">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
