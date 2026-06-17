
import { useState, useEffect } from 'react';
import CalendlyButton from './CalendlyButton';
import { clientGetSiteConfig } from '../lib/airtable-client';

export default function Nav({ config: serverConfig = {} }) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState(serverConfig);

  useEffect(() => {
    if (!serverConfig.calendly_url) {
      clientGetSiteConfig().then(c => { if (c.calendly_url) setConfig(c); });
    }
  }, []);

  const calendly = config.calendly_url || '';

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--blue)', borderBottom: '2px solid rgba(240,120,35,0.25)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>
            Waren<span style={{ color: 'var(--orange)' }}>.</span>
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Operational Infrastructure
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desk-nav">
          {['Work', 'Process', 'About'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = 'var(--orange)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>{l}</a>
          ))}
          <CalendlyButton url={calendly} style={{ background: 'var(--orange)', color: '#fff', fontSize: 12, fontWeight: 800, padding: '9px 20px', borderRadius: 'var(--radius)', letterSpacing: '0.06em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
            Free Audit →
          </CalendlyButton>
        </div>

        <button onClick={() => setOpen(!open)} style={{ display: 'none', color: '#fff', fontSize: 22 }} className="mob-menu" aria-label="Toggle menu">☰</button>
      </div>

      {open && (
        <div style={{ background: 'var(--blue-2)', padding: '16px 32px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Work', 'Process', 'About'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</a>
          ))}
          <CalendlyButton url={calendly} style={{ background: 'var(--orange)', color: '#fff', fontSize: 13, fontWeight: 800, padding: '10px 20px', borderRadius: 'var(--radius)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em', border: 'none', cursor: 'pointer', width: '100%' }}>
            Book Free Audit →
          </CalendlyButton>
        </div>
      )}

      <style>{`@media(max-width:720px){.desk-nav{display:none!important}.mob-menu{display:block!important}}`}</style>
    </nav>
  );
}
