
import { useState, useEffect } from 'react';
import CalendlyButton from './CalendlyButton';
import { clientGetSiteConfig, clientSubmitLead } from '../lib/airtable-client';

export default function CTA({ config: serverConfig = {} }) {
  const [config, setConfig] = useState(serverConfig);
  const [form, setForm] = useState({ name: '', email: '', business: '', problem: '' });
  const [status, setStatus] = useState('idle');

  // Re-fetch config client-side in case server fetch was blocked
  useEffect(() => {
    if (!serverConfig.calendly_url) {
      clientGetSiteConfig().then(c => { if (c.calendly_url) setConfig(c); });
    }
  }, []);

  const calendly = config.calendly_url || '';

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      await clientSubmitLead({
        name: form.name,
        email: form.email,
        business: form.business,
        problem_description: form.problem,
        source: 'Portfolio Website',
        status: 'New',
        submitted_at: new Date().toISOString(),
      });
      setStatus('success');
      setForm({ name: '', email: '', business: '', problem: '' });
    } catch (err) {
      console.error('Lead error:', err.message);
      setStatus('error');
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 'var(--radius)', color: '#fff',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
    display: 'block', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  return (
    <section style={{
      padding: '96px 32px',
      background: 'var(--blue)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}
          className="cta-grid">

          {/* Left — book call */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 2, background: 'var(--orange)' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                Start Here
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 900,
              color: '#fff', lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.025em',
            }}>
              Book a free 20-minute operational mapping call.
            </h2>

            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 32 }}>
              We look at how your business currently tracks clients, manages data, and handles follow-up. You leave with a clear picture of exactly where your operational gaps are.
            </p>

            <CalendlyButton url={calendly} style={{
              background: 'var(--orange)', color: '#fff',
              fontWeight: 800, fontSize: 14, padding: '15px 32px',
              borderRadius: 'var(--radius)', letterSpacing: '0.05em',
              textTransform: 'uppercase', border: 'none', cursor: 'pointer',
            }}>
              Book Free Audit Call →
            </CalendlyButton>

            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['20 minutes. No sales pressure.', 'You work directly with me.', 'East Africa · UK · USA · Remote.'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(82,209,124,0.2)', border: '1px solid rgba(82,209,124,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: '#52d17c' }}>✓</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — lead form → Airtable Leads table directly from browser */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 'var(--radius-lg)', padding: '28px',
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
              Or send a quick note
            </div>

            {status === 'success' ? (
              <div style={{ background: 'rgba(26,125,82,0.2)', border: '1px solid rgba(26,125,82,0.4)', borderRadius: 'var(--radius)', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#52d17c', marginBottom: 6 }}>Message received.</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>I will respond within 24 hours.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'name', label: 'Your Name', type: 'text', placeholder: 'e.g. James Kariuki' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'james@company.co.ke' },
                  { key: 'business', label: 'Business / Company', type: 'text', placeholder: 'e.g. Kariuki Wholesale, Nairobi' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} required
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>What is the operational problem?</label>
                  <textarea
                    placeholder="e.g. I track client debts in WhatsApp and I have no idea who owes me what..."
                    value={form.problem}
                    onChange={e => setForm({ ...form, problem: e.target.value })}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={status === 'loading'} style={{
                  background: status === 'loading' ? 'rgba(255,255,255,0.2)' : 'var(--orange)',
                  color: '#fff', fontWeight: 800, fontSize: 14,
                  padding: '13px', borderRadius: 'var(--radius)',
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer', border: 'none',
                  transition: 'background 0.15s',
                }}>
                  {status === 'loading' ? 'Sending…' : 'Send Message →'}
                </button>
                {status === 'error' && (
                  <p style={{ fontSize: 12, color: '#fca5a5', textAlign: 'center' }}>
                    Something went wrong. Email directly: warenodhiambo2@gmail.com
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){.cta-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}



