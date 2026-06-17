
export default function About({ config = {} }) {
  const calendly = config.calendly_url || '#';
  const portfolioUrl = config.portfolio_url || '#';

  return (
    <section id="about" style={{
      padding: '96px 32px',
      background: 'var(--off)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 360px', gap: 64, alignItems: 'start',
      }} className="about-grid">
        {/* Left — copy */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 2, background: 'var(--orange)' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              About
            </span>
          </div>

          {/* Hook — exact blueprint copy */}
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900,
            color: 'var(--orange)', lineHeight: 1.2, marginBottom: 24,
          }}>
            There is a specific point in every growing service business where the problem changes shape.
          </h2>

          {[
            `The team has grown. Revenue is up. But the founder is working more hours, not fewer. Decisions take longer, not shorter. Data exists — it just lives in three different places, none of which update each other.`,
            `That is not a people problem. It is an infrastructure problem.`,
          ].map((p, i) => (
            <p key={i} style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 18 }}>{p}</p>
          ))}

          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
            <strong style={{ color: 'var(--blue)' }}>I build operational infrastructure.</strong>{' '}
            <span style={{ color: 'var(--muted)' }}>
              The structured layer between a business that runs on the founder's knowledge and one that runs on systems that hold that knowledge without the founder needing to be present.
            </span>
          </p>

          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 20, color: 'var(--muted)' }}>
            My work moves through three connected stages:
          </p>

          {[
            { stage: 'Structure', desc: 'Database architecture that gives every piece of business data one accurate, queryable home. Every client, lead, and transaction in one place, connected and readable.' },
            { stage: 'Automate', desc: 'Workflow logic that makes data trigger action without manual input. Customer reminders that fire on schedule. Pipeline alerts when a deal goes quiet. Reports that exist before the workday starts.' },
            { stage: 'Illuminate', desc: 'Dashboards and reporting that turn operational data into decisions a founder can read, trust, and act on the same day.' },
          ].map(item => (
            <div key={item.stage} style={{
              display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start',
            }}>
              <div style={{
                background: 'var(--blue)', color: '#fff',
                fontSize: 10, fontWeight: 800, padding: '4px 11px',
                borderRadius: 20, letterSpacing: '0.07em', flexShrink: 0, marginTop: 3,
              }}>{item.stage}</div>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}

          {/* Paroha proof */}
          <div style={{
            borderLeft: '3px solid var(--orange)',
            background: 'var(--orange-pale)',
            padding: '16px 20px', margin: '28px 0', borderRadius: '0 var(--radius) var(--radius) 0',
          }}>
            <p style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--blue-2)', lineHeight: 1.7, margin: 0 }}>
              At Paroha Investment Limited, I redesigned the month-end reporting process — reducing 3 days of manual reconciliation across multiple data sources to an automated daily report. I built the logistics tracking system, the sales pipeline infrastructure, and the customer automation workflows that eliminated manual follow-up across the operations team.
            </p>
          </div>

          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28 }}>
            I am a Computer Science student at Kisii University. I work fully remote with clients across East Africa, the UK, and the USA. I take a small number of projects at a time. You work directly with me from the first call to the final handover.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href={calendly} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue)' }}>
              → Free operational mapping call (20 min)
            </a>
          </div>
        </div>

        {/* Right — credential stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Education', value: 'BSc Computer Science\nKisii University, Kenya' },
            { label: 'Live Work', value: 'Data & Automation Analyst\nParoha Investment Limited' },
            { label: 'Location', value: 'Nairobi, Kenya\nFully Remote · East Africa · UK · USA' },
            { label: 'Capacity', value: '2–3 projects at a time\nYou work directly with me throughout' },
            { label: 'Pipeline Stages', value: 'Structure → Automate → Illuminate' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--white)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '14px 18px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue)', whiteSpace: 'pre-line', lineHeight: 1.55 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:860px){
          .about-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  );
}
