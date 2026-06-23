

import { useState, useEffect, useRef } from 'react';
import { clientGetSiteConfig } from '../lib/airtable-client';

const SLIDES = [
  {
    eyebrow: 'The Problem',
    headline: 'There is a specific point where the problem changes shape.',
    checks: [
      'The team has grown. Revenue is up.',
      'But the founder is working more hours, not fewer.',
      'Data exists — in three places, none of which update each other.',
    ],
  },
  {
    eyebrow: 'The Infrastructure',
    headline: 'Every record. One accurate, queryable home.',
    checks: [
      'Customer reminders that fire on schedule.',
      'Pipeline alerts when a deal goes quiet.',
      'Reports that exist before the workday starts.',
    ],
  },
  {
    eyebrow: 'The Proof',
    headline: '3 days of manual work → an automated daily report.',
    checks: [
    
      'Logistics tracking + sales pipeline rebuilt.',
      'Manual follow-up eliminated across the team.',
    ],
  },
  {
    eyebrow: 'The Outcome',
    headline: 'The founder stops being the system.',
    checks: [
      'Decisions become data-backed, not memory-based.',
      'The business scales without adding overhead.',
      'Operational visibility — same day, every day.',
    ],
  },
];

export default function EntryGate({ config: serverConfig = {} }) {
  const [config, setConfig]     = useState(serverConfig);
  const [visible, setVisible]   = useState(true);
  const [mounted, setMounted]   = useState(false);
  const [slide, setSlide]       = useState(0);
  const [imgIdx, setImgIdx]     = useState(0);
  const [fading, setFading]     = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    setMounted(true);
    clientGetSiteConfig().then(c => {
      if (Object.keys(c).length) setConfig(p => ({ ...p, ...c }));
    }).catch(() => {});
  }, []);

  const images = mounted
    ? [config.logistics_url, config.crm_url, config.airtable_url, config.operations_url].filter(Boolean)
    : [];

  useEffect(() => {
    timer.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSlide(s => (s + 1) % SLIDES.length);
        setImgIdx(i => images.length > 1 ? (i + 1) % images.length : i);
        setFading(false);
      }, 450);
    }, 4500);
    return () => clearInterval(timer.current);
  }, [images.length]);

  function dismiss() {
    const el = document.getElementById('eg');
    if (el) { el.style.transition = 'opacity 0.5s'; el.style.opacity = '0'; }
    setTimeout(() => setVisible(false), 500);
  }

  if (!visible) return null;

  const cur   = SLIDES[slide];
  const img   = images[imgIdx] || null;
  const github = config.github_url || 'https://github.com/WarenOdhiambo4';

  return (
    <div id="eg" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Nunito', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ═══ LEFT — dark panel with floating image card ═══ */}
      <div style={{
        background: 'linear-gradient(160deg, #0C2151 0%, #060F2A 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '52px 52px', pointerEvents: 'none',
        }} />
        {/* Warm glow centre */}
        <div style={{
          position: 'absolute', top: '35%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,120,35,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floating image card — matches reference */}
        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: 360,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.45s ease',
          background: '#0C2151',
        }}>
          {/* Image */}
          <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
              }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #163270 0%, #0C2151 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.14em', textAlign: 'center', lineHeight: 2 }}>
                  ADD IMAGES IN AIRTABLE<br />logistics_url · crm_url<br />airtable_url · operations_url
                </div>
              </div>
            )}
            {/* Gradient fade at bottom of image */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
              background: 'linear-gradient(to top, rgba(12,33,81,1), transparent)',
            }} />
          </div>

          {/* Card caption — matches reference style */}
          <div style={{ padding: '14px 20px 18px', background: '#0C2151' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              Operational Systems
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Waren Odhiambo · Infrastructure Builder
            </div>
          </div>

          {/* Orange bottom accent line */}
          <div style={{ height: 3, background: '#F07823' }} />
        </div>

        {/* Slide dots below card */}
        <div style={{ display: 'flex', gap: 6, marginTop: 24, position: 'relative', zIndex: 2 }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? 20 : 5, height: 3,
              background: i === slide ? '#F07823' : 'rgba(255,255,255,0.2)',
              borderRadius: 2, cursor: 'pointer',
              transition: 'width 0.3s, background 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* ═══ RIGHT — clean white/off-white content panel ═══ */}
      <div style={{
        background: '#ffffff',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '72px 64px',
        position: 'relative',
      }}>

        {/* Pill tag — matches reference */}
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(12,33,81,0.06)',
          border: '1.5px solid rgba(12,33,81,0.12)',
          borderRadius: 20, padding: '5px 14px',
          marginBottom: 28, width: 'fit-content',
        }}>
          <span style={{
            fontSize: 11, fontWeight: 800, color: '#0C2151',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            {cur.eyebrow}
          </span>
        </div>

        {/* Headline — bold, large, dark blue */}
        <h1 style={{
          fontSize: 'clamp(26px, 2.8vw, 42px)',
          fontWeight: 900, color: '#0C2151',
          lineHeight: 1.12, letterSpacing: '-0.025em',
          marginBottom: 28,
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.45s ease',
        }}>
          {cur.headline}
        </h1>

        {/* Checklist — matches reference */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 14,
          marginBottom: 44,
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.45s ease',
        }}>
          {cur.checks.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                background: 'rgba(240,120,35,0.12)',
                border: '1.5px solid rgba(240,120,35,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#F07823" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, color: '#3a4a60', lineHeight: 1.5, fontWeight: 600 }}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Primary button — orange, full width, strong */}
        <button onClick={dismiss} style={{
          width: '100%', padding: '16px 0',
          background: '#F07823', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          fontSize: 15, fontWeight: 900,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          fontFamily: "'Nunito', sans-serif",
          boxShadow: '0 4px 20px rgba(240,120,35,0.35)',
          transition: 'background 0.15s, transform 0.15s, box-shadow 0.15s',
          marginBottom: 12,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d9651a'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(240,120,35,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F07823'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(240,120,35,0.35)'; }}
        >
          Continue to Website →
        </button>

        {/* Secondary — GitHub, subtle */}
        <a href={github} target="_blank" rel="noopener noreferrer" style={{
          width: '100%', padding: '14px 0', textAlign: 'center',
          background: 'transparent', color: '#5a6880',
          border: '1.5px solid #dce3ef', borderRadius: 8,
          fontSize: 13, fontWeight: 700, letterSpacing: '0.06em',
          fontFamily: "'Nunito', sans-serif",
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'border-color 0.15s, color 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0C2151'; e.currentTarget.style.color = '#0C2151'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#dce3ef'; e.currentTarget.style.color = '#5a6880'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
          </svg>
          View on GitHub
        </a>

        {/* Footer */}
        <div style={{ marginTop: 36, fontSize: 11, color: '#b8c4d4', fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '0.06em' }}>
          Structure · Automate · Illuminate
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          #eg{grid-template-columns:1fr!important;overflow-y:auto!important;}
          #eg>div:last-child{padding:40px 28px 48px!important;}
        }
      `}</style>
    </div>
  );
}
