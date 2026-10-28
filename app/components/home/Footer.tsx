'use client';

import Image from 'next/image';
import { Icons } from '../Icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <Image src="/logo.png" alt="BlackMail Logo" width={100} height={30} className="footer-logo" priority />
          <p className="footer-description">
            Fast and secure disposable temporary email service. Protect your privacy and keep your inbox spam-free.
          </p>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="/policy">Features</a></li>
            <li><a href="/policy">Pricing</a></li>
            <li><a href="/policy">API Documentation</a></li>
            <li><a href="/policy">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="https://linkedin.com/in/princesahu7z" target="_blank" rel="noopener noreferrer">Help Center</a></li>
            <li><a href="https://linkedin.com/in/princesahu7z" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
            <li><a href="/policy">Terms of Service</a></li>
            <li><a href="/policy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Stay Connected</h4>
          <div className="social-links">
            <a href="https://x.com/PrinceSahu69495" aria-label="Twitter"><Icons.X /></a>
            <a href="https://github.com/Prince7z" aria-label="GitHub"><Icons.GitHub /></a>
            <a href="https://linkedin.com/in/princesahu7z" aria-label="LinkedIn"><Icons.MessageCircle /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BlackMail. All rights reserved.</p>
      </div>
    </footer>
  );
}
