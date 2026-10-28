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
    <section className="faq-column" id="FAQ" aria-labelledby="faq-section-title">
      <div className="faq-heading">
        <div>
          <span className="home-section-eyebrow">Good to know</span>
          <h2 id="faq-section-title">Frequently asked questions</h2>
        </div>
        <p>Quick answers to help you use BlackMail with confidence.</p>
      </div>
      {faqs.map((faq, i) => (
        <div key={faq.question} className={`faq-item ${active === i ? 'active' : ''}`}>
          <button
            type="button"
            id={`faq-question-${i}`}
            className="faq-question"
            onClick={() => setActive(active === i ? null : i)}
            aria-expanded={active === i}
            aria-controls={`faq-answer-${i}`}
          >
            <span>{faq.question}</span>
            <span className="faq-chevron" aria-hidden="true" />
          </button>
          <p id={`faq-answer-${i}`} className="faq-answer">{faq.answer}</p>
        </div>
      ))}
    </section>
  );
}
