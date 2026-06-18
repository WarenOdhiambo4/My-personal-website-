// components/Footer.js
import { useState, useEffect } from 'react';
import { clientGetSiteConfig } from '../lib/airtable-client';

export default function Footer({ config: serverConfig = {} }) {
  const [config, setConfig] = useState(serverConfig);

  useEffect(() => {
    clientGetSiteConfig().then(c => { if (Object.keys(c).length > 0) setConfig(c); });
  }, []);

  // linkedin_url is in Site Config table (verified in screenshot)
  const linkedinUrl = config.linkedin_url || 'https://linkedin.com/in/waren-odhiambo';
  const email = config.email || 'warenodhiambo2@gmail.com';

  return (
    <footer style={{ background: '#070e1a', padding: '36px 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>
            Waren<span style={{ color: 'var(--orange)' }}>.</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>
            Operational Infrastructure Builder · Nairobi, Kenya
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = 'var(--orange)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
            LinkedIn
          </a>
          <a href={`mailto:${email}`}
            style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.target.style.color = 'var(--orange)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
            Email
          </a>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>
          Structure → Automate → Illuminate
        </div>
      </div>
    </footer>
  );
}
