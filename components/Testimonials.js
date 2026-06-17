
export default function Testimonials({ testimonials = [] }) {
  if (!testimonials.length) return null;

  return (
    <section style={{
      padding: '80px 32px',
      background: 'var(--white)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ width: 28, height: 2, background: 'var(--orange)' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            What Clients Say
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {testimonials.map(t => (
            <div key={t.id} style={{
              background: 'var(--off)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '24px 22px',
              position: 'relative',
            }}>
              <div style={{
                fontSize: 48, lineHeight: 1, color: 'var(--orange)', opacity: 0.25,
                fontFamily: 'serif', position: 'absolute', top: 12, right: 18,
              }}>"</div>
              <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 18 }}>
                "{t.quote}"
              </p>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue)' }}>{t.client_name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.role}{t.company ? ` · ${t.company}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
