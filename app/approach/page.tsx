import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Approach — Dovetail Architecture',
  description: 'Himalayan architectural methodology grounded in Place, Time, and Continuity.',
};

export default function ApproachPage() {
  return (
    <div className="approach-page">
      <section className="approach-page-hero" style={{ maxWidth: '1600px', margin: '100px auto 0', padding: '60px 48px 80px', borderBottom: '1px solid var(--line)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--muted)' }}>
          PRACTICE PHILOSOPHY & METHODOLOGY
        </span>
        <h1 className="approach-page-title" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(52px, 8vw, 108px)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.02em', margin: '24px 0 36px' }}>
          Place.<br />
          Time.<br />
          Continuity.
        </h1>
        <p className="approach-page-intro" style={{ fontSize: '16px', lineHeight: 1.9, color: '#444', maxWidth: '720px', fontWeight: 300 }}>
          Dovetail Architecture was founded on a singular premise: building in the high mountains demands listening before intervening. Our projects emerge directly from local geology, microclimates, ancestral craftsmanship, and contemporary spatial needs.
        </p>
      </section>

      {/* Pillars Section */}
      <section className="approach-pillars-section" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 48px' }}>
        {/* Pillar 1 */}
        <div className="pillar-row" style={{ display: 'grid', gridTemplateColumns: '100px 1.2fr 1.8fr', gap: '60px', padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="pillar-index" style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--muted)' }}>
            01 / PLACE
          </div>
          <div className="pillar-title-wrap">
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px, 4vw, 56px)', fontWeight: 400, lineHeight: 1, marginBottom: '12px' }}>
              Topography & Climate
            </h2>
            <span className="pillar-tagline" style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Responding to Slope and Sun
            </span>
          </div>
          <div className="pillar-content" style={{ fontSize: '14px', lineHeight: 1.95, color: '#333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p>
              In mountainous regions, the landscape is never neutral ground. Every parcel carries its own sun angles, wind funnels, snow-loading dynamics, and water flow channels.
            </p>
            <blockquote className="pillar-quote" style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontStyle: 'italic', lineHeight: 1.5, color: 'var(--ink)', borderLeft: '2px solid var(--ink)', paddingLeft: '20px', margin: '16px 0' }}>
              "We do not impose forms onto mountain terrain; we excavate and arrange volumes that let the mountain complete the architecture."
            </blockquote>
            <p>
              Rather than cut-and-fill grading that compromises fragile slopes, our structures step down natural contours using terracing, pin foundations, and thermal mass strategies.
            </p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="pillar-row" style={{ display: 'grid', gridTemplateColumns: '100px 1.2fr 1.8fr', gap: '60px', padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="pillar-index" style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--muted)' }}>
            02 / TIME
          </div>
          <div className="pillar-title-wrap">
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px, 4vw, 56px)', fontWeight: 400, lineHeight: 1, marginBottom: '12px' }}>
              Material Memory
            </h2>
            <span className="pillar-tagline" style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Conservation · Craft · Weathering
            </span>
          </div>
          <div className="pillar-content" style={{ fontSize: '14px', lineHeight: 1.95, color: '#333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p>
              Centuries of Himalayan building traditions—such as Kath-Kuni timber-laced stone in Himachal and Rammed Earth / Mud-brick in Ladakh—have weathered seismic shocks and severe winters.
            </p>
            <p>
              We celebrate local stone, untreated deodar wood, river gravel, and breathable lime plasters. These materials age gracefully, patina with seasonal snowfalls, and can be recycled back into the earth.
            </p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="pillar-row" style={{ display: 'grid', gridTemplateColumns: '100px 1.2fr 1.8fr', gap: '60px', padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
          <div className="pillar-index" style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--muted)' }}>
            03 / CONTINUITY
          </div>
          <div className="pillar-title-wrap">
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(38px, 4vw, 56px)', fontWeight: 400, lineHeight: 1, marginBottom: '12px' }}>
              Adaptive Reuse
            </h2>
            <span className="pillar-tagline" style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Preserving Heritage through Contemporary Life
            </span>
          </div>
          <div className="pillar-content" style={{ fontSize: '14px', lineHeight: 1.95, color: '#333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p>
              Conservation is not about freezing buildings as museum relics; it is about keeping cultural heritage functional, secure, and inhabited.
            </p>
            <p>
              From royal palaces in Ladakh to colonial tea bungalows in Kangra, our interventions stabilize historical structures, introduce invisible structural reinforcements, and configure them for modern hospitality, education, or dwelling.
            </p>
          </div>
        </div>
      </section>

      {/* Research & Field Studies */}
      <section className="studio-research-section" style={{ maxWidth: '1600px', margin: '0 auto', padding: '80px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        <article className="research-card" style={{ borderTop: '1px solid var(--line-med)', paddingTop: '24px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>FIELD PUBLICATION 01</span>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '24px', margin: '8px 0' }}>Seismic Resilience in Kath-Kuni Structures</h3>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
            Empirical documentation of interlocking timber corner joints and dry-rubble infill under earthquake shear stress in the Beas and Parvati valleys.
          </p>
        </article>

        <article className="research-card" style={{ borderTop: '1px solid var(--line-med)', paddingTop: '24px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>FIELD PUBLICATION 02</span>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '24px', margin: '8px 0' }}>Thermal Envelopes in Trans-Himalayan Mud Fabric</h3>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
            Passive solar gain and nocturnal re-radiation measurements across high-altitude domestic dwellings in Leh and Zanskar.
          </p>
        </article>

        <article className="research-card" style={{ borderTop: '1px solid var(--line-med)', paddingTop: '24px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>FIELD PUBLICATION 03</span>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '24px', margin: '8px 0' }}>Water Management & Riparian Public Edges</h3>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
            Landscape methodologies for rehabilitating ancient stone ghats and temple irrigation streams against cloudburst discharge events.
          </p>
        </article>
      </section>
    </div>
  );
}
