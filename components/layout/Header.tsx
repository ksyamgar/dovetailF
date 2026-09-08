'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="nav" id="site-nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo-wrap" aria-label="Dovetail Architecture — Home">
          <Image
            src="/logo.png"
            alt="Dovetail Architecture"
            width={160}
            height={36}
            priority
            className="nav-logo"
            style={{ width: 'auto', height: '32px' }}
          />
        </Link>
        <nav className="nav-links" id="nav-links" aria-label="Primary navigation">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'nav-link--active' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/projects"
            className={`nav-link ${pathname?.startsWith('/projects') ? 'nav-link--active' : ''}`}
          >
            Projects
          </Link>
          <Link
            href="/approach"
            className={`nav-link ${pathname === '/approach' ? 'nav-link--active' : ''}`}
          >
            Approach
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${pathname === '/contact' ? 'nav-link--active' : ''}`}
          >
            Contact
          </Link>
        </nav>
        <button
          className={`nav-menu-btn ${mobileMenuOpen ? 'nav-menu-btn--active' : ''}`}
          id="mobile-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
      {/* Mobile menu */}
      <div
        className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav--open' : ''}`}
        id="mobile-nav"
        aria-hidden={!mobileMenuOpen}
        style={{ display: mobileMenuOpen ? 'flex' : 'none' }}
      >
        <Link href="/" className="mobile-nav-link" onClick={closeMobileMenu}>
          Home
        </Link>
        <Link href="/projects" className="mobile-nav-link" onClick={closeMobileMenu}>
          Projects
        </Link>
        <Link href="/approach" className="mobile-nav-link" onClick={closeMobileMenu}>
          Approach
        </Link>
        <Link href="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>
          Contact
        </Link>
      </div>
    </header>
  );
};
