// components/Hero.js — RESTORED EXACTLY
import { useState, useEffect } from 'react';
import CalendlyButton from './CalendlyButton';
import { clientGetSiteConfig } from '../lib/airtable-client';

export default function Hero({ config: serverConfig = {} }) {
  const [config, setConfig] = useState(serverConfig);
  const [imgError, setImgError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!serverConfig.profile_image_url || !serverConfig.calendly_url) {
      clientGetSiteConfig().then(c => {
        if (c && Object.keys(c).length > 0) {
          setConfig(prev => ({ ...prev, ...c }));
        }
      }).catch(() => {});
    }
  }, []);

  const imageUrl = (mounted && !imgError && config.profile_image_url)
    ? config.profile_image_url : '';
  const availability = config.availability || 'Accepting new projects';
  const calendly = config.calendly_url || '';

  return (
    <>
      <section style={{ background: 'var(--blue)', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-desktop" style={{
          display: 'grid',
          gridTemplateColumns: imageUrl ? '1fr 520px' : '1fr',
          minHeight: '90vh',
          alignItems: 'stretch',
        }}>
          {/* Left — copy */}
          <div style={{
            padding: '72px 48px 72px 56px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', background: 'linear-gradient(to bottom, var(--orange), transparent)' }} />

            {/* Availability */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,125,82,0.18)', border: '1px solid rgba(26,125,82,0.45)', borderRadius: 20, padding: '5px 14px', marginBottom: 28, width: 'fit-content' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#52d17c', boxShadow: '0 0 0 3px rgba(82,209,124,0.3)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#52d17c', letterSpacing: '0.08em' }}>{availability}</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(30px, 3.8vw, 54px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
              I Build Operational<br />Infrastructure<br />
              <span style={{ color: 'var(--orange)' }}>for Businesses That<br />Have Outgrown Their</span><br />
              Spreadsheets
            </h1>

            {/* Pipeline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Structure', fill: false }, { label: '→', arrow: true },
                { label: 'Automate', fill: true },   { label: '→', arrow: true },
                { label: 'Illuminate', fill: false },
              ].map((item, i) => item.arrow
                ? <span key={i} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>→</span>
                : <span key={i} style={{ fontSize: 13, fontWeight: 700, padding: '6px 18px', borderRadius: 20, background: item.fill ? 'var(--orange)' : 'transparent', border: item.fill ? 'none' : '1.5px solid rgba(240,120,35,0.5)', color: item.fill ? '#fff' : 'var(--orange)' }}>{item.label}</span>
              )}
            </div>

            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 460, marginBottom: 40 }}>
              The founder stops being the system.<br />The business starts running on one.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <CalendlyButton url={calendly} style={{ background: 'var(--orange)', color: '#fff', fontWeight: 800, fontSize: 14, padding: '15px 32px', borderRadius: 'var(--radius)', letterSpacing: '0.05em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
                Book Free Audit →
              </CalendlyButton>
              <a href="#work" style={{ border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)', fontWeight: 700, fontSize: 14, padding: '15px 28px', borderRadius: 'var(--radius)', display: 'inline-block' }}>
                See Case Studies
              </a>
            </div>

            {/* Proof */}
            <div style={{ marginTop: 40, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {['3-day reconciliation → automated daily report', 'Paroha Investment Limited', 'Nairobi · Remote · Global'].map((t, i) => (
                <span key={i} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {i > 0 && <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>}{t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — image, only after mount */}
          {imageUrl && (
            <div className="hero-img-desktop" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: '35%', height: '100%', background: 'linear-gradient(to right, var(--blue), transparent)', zIndex: 2 }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '20%', background: 'linear-gradient(to top, var(--blue), transparent)', zIndex: 2 }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Waren Odhiambo"
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', minHeight: '90vh' }} />
            </div>
          )}
        </div>
      </section>

      {/* Mobile image */}
      {imageUrl && (
        <div className="hero-img-mobile" style={{ display: 'none', background: 'var(--blue)', overflow: 'hidden', maxHeight: 420 }}>
          <div style={{ position: 'relative', overflow: 'hidden', maxHeight: 420 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '20%', background: 'linear-gradient(to bottom, var(--blue), transparent)', zIndex: 2 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '25%', background: 'linear-gradient(to top, var(--blue), transparent)', zIndex: 2 }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Waren Odhiambo" onError={() => setImgError(true)}
              style={{ width: '100%', height: 420, objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
          </div>
        </div>
      )}

      <style>{`
        @media(max-width: 900px) {
          .hero-desktop { grid-template-columns: 1fr !important; min-height: unset !important; }
          .hero-img-desktop { display: none !important; }
          .hero-img-mobile { display: block !important; }
          .hero-desktop > div:first-child { padding: 48px 24px 40px 28px !important; }
        }
      `}</style>
    </>
  );
}
