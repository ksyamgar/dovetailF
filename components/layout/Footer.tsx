'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        {/* Column 1: Brand & Philosophy */}
        <div className="footer-col footer-col-brand">
          <div className="footer-brand-lockup">
            <Image
              src="/logo.png"
              alt="Dovetail Architecture"
              width={180}
              height={40}
              className="footer-logo"
              style={{ width: 'auto', height: '36px' }}
            />
          </div>
          <div className="footer-col-divider"></div>
          <p className="footer-tagline">
            Architecture rooted in place,<br />
            crafted with clarity.
          </p>
        </div>

        {/* Column 2: Studio */}
        <div className="footer-col">
          <h4 className="footer-col-heading">STUDIO</h4>
          <div className="footer-col-divider"></div>
          <div className="footer-studio-main">
            <svg className="footer-studio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>
            <span>Palampur (Main Studio)</span>
          </div>
          <p className="footer-address">
            First Floor, Main Bazaar,<br />
            Palampur, Himachal Pradesh 176061
          </p>
        </div>

        {/* Column 3: Navigation */}
        <div className="footer-col">
          <h4 className="footer-col-heading">NAVIGATION</h4>
          <div className="footer-col-divider"></div>
          <ul className="footer-nav-list">
            <li>
              <Link href="/">
                <span>Home</span>
                <span className="nav-arrow">&rarr;</span>
              </Link>
            </li>
            <li>
              <Link href="/projects">
                <span>Projects</span>
                <span className="nav-arrow">&rarr;</span>
              </Link>
            </li>
            <li>
              <Link href="/approach">
                <span>Approach</span>
                <span className="nav-arrow">&rarr;</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span>Contact</span>
                <span className="nav-arrow">&rarr;</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-col">
          <h4 className="footer-col-heading">CONTACT</h4>
          <div className="footer-col-divider"></div>
          <div className="footer-contact-items">
            <a href="mailto:Studio@dovetailarchitecture.in" className="footer-contact-row">
              <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
              <span>Studio@dovetailarchitecture.in</span>
            </a>
            <a href="tel:+918091488858" className="footer-contact-row">
              <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+91 80914 88858</span>
            </a>
          </div>
          <div className="footer-social-row">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>Instagram</span>
              <span className="footer-social-arrow">&#8599;</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <svg className="footer-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span>LinkedIn</span>
              <span className="footer-social-arrow">&#8599;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <span className="footer-copyright">&copy; {new Date().getFullYear()} Dovetail Architecture. All rights reserved.</span>
        <button className="footer-back-to-top" onClick={scrollToTop} aria-label="Back to top">
          <span>&uarr; Back to top</span>
        </button>
      </div>
    </footer>
  );
};
