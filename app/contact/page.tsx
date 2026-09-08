import React from 'react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Dovetail Architecture',
  description: 'Reach out to our studios across the Himalayas. Main studio in Palampur, H.P.',
};

export default function ContactPage() {
  return (
    <div className="contact-page" style={{ maxWidth: '1440px', margin: '100px auto 80px', padding: '0 48px' }}>
      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--line)', paddingBottom: '60px', marginBottom: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '60px', alignItems: 'end' }}>
          <div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--muted)' }}>
              DOVETAIL ARCHITECTURE · GET IN TOUCH
            </span>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 400, lineHeight: 1.05, margin: '16px 0 24px' }}>
              Let's Begin<br />a Conversation
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.85, color: '#444', maxWidth: '640px' }}>
              Whether you have a site in the mountains, a heritage structure to restore, or simply want to understand what we do — we welcome every enquiry with care.
            </p>
          </div>

          <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '40px', fontFamily: 'var(--mono)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '10px', marginBottom: '2px' }}>PRIMARY STUDIO</div>
              <div>32.1196°N  76.5399°E</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '10px', marginBottom: '2px' }}>ALTITUDE</div>
              <div>1,312 m ASL</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '10px', marginBottom: '2px' }}>TIMEZONE</div>
              <div>IST · UTC +5:30</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: '10px', marginBottom: '2px' }}>REGION</div>
              <div>Western Himalayas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Form & Studio Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.16em', color: 'var(--muted)', marginBottom: '28px' }}>
            PROJECT ENQUIRY FORM
          </h2>
          <ContactForm />
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.16em', color: 'var(--muted)', marginBottom: '28px' }}>
            STUDIO LOCATIONS & DIRECT CHANNELS
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', marginBottom: '8px' }}>
                Palampur (Main Studio)
              </h3>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
                First Floor, Main Bazaar, Palampur<br />
                Kangra District, Himachal Pradesh 176061<br />
                India
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', marginBottom: '8px' }}>
                Direct Correspondence
              </h3>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  Email: <a href="mailto:Studio@dovetailarchitecture.in" style={{ textDecoration: 'underline' }}>Studio@dovetailarchitecture.in</a>
                </div>
                <div>
                  Phone: <a href="tel:+918091488858" style={{ textDecoration: 'underline' }}>+91 80914 88858</a>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', marginBottom: '8px' }}>
                Social & Press
              </h3>
              <div style={{ display: 'flex', gap: '20px', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  Instagram &#8599;
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  LinkedIn &#8599;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
