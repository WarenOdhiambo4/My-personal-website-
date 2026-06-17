// components/Process.js
const stages = [
  {
    num: '01',
    name: 'Structure',
    headline: 'Database architecture that gives every piece of business data one accurate, queryable home.',
    detail: 'Every client, lead, transaction, and operational record in one connected place. No more hunting across three different spreadsheets for the same number. One source of truth that updates itself.',
    signals: ['Customer & Lead Database', 'Transaction Records', 'Linked Relational Tables', 'Airtable Architecture', 'SQL Schema Design'],
  },
  {
    num: '02',
    name: 'Automate',
    headline: 'Workflow logic that makes data trigger action without manual input.',
    detail: 'Customer reminders that fire on schedule. Pipeline alerts when a deal goes quiet. Reports that exist before the workday starts. The operations team stops chasing — the system handles the follow-through.',
    signals: ['n8n Workflow Automation', 'Airtable Automations', 'Zapier Integration', 'Scheduled Reports', 'Follow-up Sequences'],
    accent: true,
  },
  {
    num: '03',
    name: 'Illuminate',
    headline: 'Dashboards and reporting that turn operational data into decisions you can act on the same day.',
    detail: "The founder no longer has to chase the data. The data finds them. One dashboard view — revenue, pipeline, operational performance — readable without asking anyone to compile it.",
    signals: ['Business Intelligence Dashboards', 'Automated Daily Reports', 'Revenue Tracking', 'Pipeline Visibility', 'Operational KPIs'],
  },
];

export default function Process() {
  return (
    <section id="process" style={{
      background: 'var(--off)',
      padding: '96px 32px',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 2, background: 'var(--orange)' }} />
          <span style={{
            fontSize: 10, fontWeight: 800, color: 'var(--orange)',
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>How The Work Gets Done</span>
        </div>

        <h2 style={{
          fontSize: 'clamp(26px, 3.5vw, 42px)',
          fontWeight: 900, color: 'var(--blue)',
          letterSpacing: '-0.025em', lineHeight: 1.1,
          marginBottom: 56,
        }}>
          Three connected stages.<br />One infrastructure outcome.
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {stages.map((s) => (
            <div key={s.num} style={{
              background: s.accent ? 'var(--blue)' : 'var(--white)',
              border: s.accent ? '2px solid var(--orange)' : '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 28px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Stage number */}
              <div style={{
                fontSize: 64, fontWeight: 900, lineHeight: 1,
                color: s.accent ? 'rgba(240,120,35,0.12)' : 'rgba(12,33,81,0.06)',
                position: 'absolute', top: 12, right: 20,
                fontFamily: 'monospace', pointerEvents: 'none',
              }}>{s.num}</div>

              {/* Stage pill */}
              <div style={{
                display: 'inline-block',
                background: s.accent ? 'var(--orange)' : 'var(--blue)',
                color: '#fff',
                fontSize: 10, fontWeight: 800,
                padding: '4px 12px', borderRadius: 20,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: 16,
              }}>{s.name}</div>

              <h3 style={{
                fontSize: 17, fontWeight: 800,
                color: s.accent ? '#fff' : 'var(--blue)',
                lineHeight: 1.3, marginBottom: 12,
              }}>{s.headline}</h3>

              <p style={{
                fontSize: 14, color: s.accent ? 'rgba(255,255,255,0.55)' : 'var(--muted)',
                lineHeight: 1.75, marginBottom: 24,
              }}>{s.detail}</p>

              {/* Signal tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {s.signals.map(sig => (
                  <span key={sig} style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 20,
                    background: s.accent ? 'rgba(255,255,255,0.1)' : 'var(--blue-pale)',
                    color: s.accent ? 'rgba(255,255,255,0.7)' : 'var(--blue)',
                  }}>{sig}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
