import { useState, useEffect } from 'react';
import { clientGetCaseStudies, clientGetTestimonials } from '../lib/airtable-client';

const STAGE_COLORS = {
  'Structure': { bg: '#E6F1FB', color: '#0C2151' },
  'Automate':  { bg: '#FBE8D5', color: '#C85A00' },
  'Illuminate':{ bg: '#D5EDD9', color: '#1A5C2A' },
};

export default function CaseStudies({ caseStudies: serverData = [], testimonials: serverTestimonials = [] }) {
  const [caseStudies, setCaseStudies] = useState(serverData);
  const [testimonials, setTestimonials] = useState(serverTestimonials);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Always fetch client-side (server blocked on local machine)
    clientGetCaseStudies().then(d => { if (d.length) setCaseStudies(d); }).catch(() => {});
    clientGetTestimonials().then(d => { if (d.length) setTestimonials(d); }).catch(() => {});
  }, []);

  // Build a lookup: project_name → testimonial
  // Testimonials have "project_name (from linked_projects)" which is a lookup array
  const testimonialByProject = testimonials.reduce((acc, t) => {
    const names = t['project_name (from linked_projects)'];
    if (Array.isArray(names)) {
      names.forEach(n => { if (!acc[n]) acc[n] = t; });
    } else if (typeof names === 'string' && names) {
      if (!acc[names]) acc[names] = t;
    }
    return acc;
  }, {});

  return (
    <section id="work" style={{
      padding: '96px 32px',
      background: 'var(--off)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 2, background: 'var(--orange)' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Case Studies
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: 'var(--blue)',
          letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 12,
        }}>
          Production work.<br />Real operational environments.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 52, maxWidth: 540, lineHeight: 1.7 }}>
          Every system below was built for a real business with a real operational problem.
          The before state is what they were doing. The after state is what runs today.
        </p>

        {/* Case study cards — 2 per row, full width */}
        {!mounted || caseStudies.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
          }} className="cs-grid">
            {caseStudies.map(cs => {
              // Match testimonial to this case study via project_name lookup
              const projectName = Array.isArray(cs['project_name (from linked_project)'])
                ? cs['project_name (from linked_project)'][0]
                : cs['project_name (from linked_project)'];
              const testimonial = projectName ? testimonialByProject[projectName] : null;
              return (
                <CaseStudyCard key={cs.id} cs={cs} testimonial={testimonial} />
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @media(max-width: 860px) {
          .cs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function EmptyState() {
  return (
    <div style={{
      border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)',
      padding: '64px 32px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>
        No published case studies yet
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
        Add a record to Airtable → Case Studies → check "published" to display it here.
      </div>
    </div>
  );
}

function CaseStudyCard({ cs, testimonial }) {
  // Field names verified from schema:
  const title = cs.tittle || '';
  const clientType = cs.client_type || (cs['client_type (from linked_project)'] ? cs['client_type (from linked_project)'][0] : '');
  const clientName = Array.isArray(cs['client_name (from linked_project)'])
    ? cs['client_name (from linked_project)'][0]
    : cs['client_name (from linked_project)'] || '';
  const problemState = cs.problem_state || '';
  const systemBuilt = cs.system_built || '';
  const outcomeMetric = cs.outcome_metric || '';
  const stages = Array.isArray(cs.pipeline_stages) ? cs.pipeline_stages : [];
  const tools = Array.isArray(cs.tools_used) ? cs.tools_used : [];
  const loomUrl = cs.loom_url || '';
  const heroImg = cs.hero_image_url || '';

  return (
    <article style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(12,33,81,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Hero image */}
      {heroImg ? (
        <div style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {/* Client type badge over image */}
          <div style={{
            position: 'absolute', top: 16, left: 16,
            background: 'var(--blue)', color: '#fff',
            fontSize: 10, fontWeight: 800, padding: '5px 12px',
            borderRadius: 20, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>{clientType}</div>
          {/* Pipeline stages over image */}
          <div style={{ position: 'absolute', bottom: 14, left: 16, display: 'flex', gap: 6 }}>
            {stages.map(s => {
              const c = STAGE_COLORS[s] || { bg: '#eee', color: '#333' };
              return (
                <span key={s} style={{
                  fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20,
                  background: c.bg, color: c.color, letterSpacing: '0.06em',
                }}>{s}</span>
              );
            })}
          </div>
        </div>
      ) : (
        /* No image — colored header block */
        <div style={{
          background: 'var(--blue)', padding: '28px 28px 24px', flexShrink: 0,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8,
          }}>{clientType}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {stages.map(s => {
              const c = STAGE_COLORS[s] || { bg: 'rgba(255,255,255,0.15)', color: '#fff' };
              return (
                <span key={s} style={{
                  fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(240,120,35,0.25)', color: 'var(--orange)',
                  border: '1px solid rgba(240,120,35,0.4)',
                }}>{s}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Client name */}
        {clientName && (
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {clientName}
          </div>
        )}

        {/* Title */}
        <h3 style={{
          fontSize: 20, fontWeight: 900, color: 'var(--blue)',
          lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.02em',
        }}>{title}</h3>

        {/* Before → After */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12, marginBottom: 20,
        }}>
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#991B1B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Before
            </div>
            <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.55, margin: 0 }}>
              {problemState}
            </p>
          </div>
          <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#14532D', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              After
            </div>
            <p style={{ fontSize: 13, color: '#14532D', lineHeight: 1.55, margin: 0, fontWeight: 600 }}>
              {outcomeMetric}
            </p>
          </div>
        </div>

        {/* System built */}
        {systemBuilt && (
          <div style={{
            background: 'var(--off)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '14px 16px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              System Built
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
              {systemBuilt}
            </p>
          </div>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {tools.map(t => (
              <span key={t} style={{
                fontSize: 11, fontWeight: 700, padding: '4px 10px',
                background: '#E6F1FB', color: '#0C2151', borderRadius: 20,
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Testimonial — shown if linked project has one with permission */}
        {testimonial && testimonial.quote && (
          <div style={{
            background: 'var(--blue)', borderRadius: 12,
            padding: '16px 18px', marginBottom: 20,
            position: 'relative',
          }}>
            <div style={{
              fontSize: 32, lineHeight: 1, color: 'var(--orange)', opacity: 0.4,
              position: 'absolute', top: 10, right: 14,
              fontFamily: 'serif', fontWeight: 900,
            }}>"</div>
            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 12px',
              paddingRight: 24,
            }}>
              {typeof testimonial.quote === 'string'
                ? testimonial.quote
                : 'Great system built for our operations.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--orange)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0,
              }}>
                {testimonial.Name ? testimonial.Name[0].toUpperCase() : '?'}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>
                  {testimonial.Name}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                  {testimonial.role}{testimonial.business ? ` · ${testimonial.business}` : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA — spacer then button */}
        <div style={{ marginTop: 'auto', paddingTop: 4 }}>
          {loomUrl && (
            <a href={loomUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--orange)', color: '#fff',
              fontSize: 13, fontWeight: 800, padding: '11px 20px',
              borderRadius: 10, textDecoration: 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#d9651a'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--orange)'}
            >
              <span style={{ fontSize: 14 }}>▶</span> Watch System Walkthrough
            </a>
          )}
        </div>
      </div>
    </article>
  );
}























































// import { useState, useEffect } from 'react';
// import { clientGetCaseStudies } from '../lib/airtable-client';

// export default function CaseStudies({ caseStudies: serverData = [] }) {
//   const [caseStudies, setCaseStudies] = useState(serverData);

//   useEffect(() => {
//     if (!serverData.length) {
//       clientGetCaseStudies().then(d => { if (d.length) setCaseStudies(d); });
//     }
//   }, []);

//   return (
//     <section id="work" style={{ padding: '96px 32px', background: 'var(--white)', borderTop: '1px solid var(--border)' }}>
//       <div style={{ maxWidth: 1100, margin: '0 auto' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
//           <div style={{ width: 28, height: 2, background: 'var(--orange)' }} />
//           <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Case Studies</span>
//         </div>
//         <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: 'var(--blue)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 40 }}>
//           Production work.<br />Real operational environments.
//         </h2>

// //         {/* Paroha — always shown first */}
// //         <ParohaCard />

// //         {caseStudies.length > 0 && (
// //           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20, marginTop: 20 }}>
// //             {caseStudies.map(cs => <CaseStudyCard key={cs.id} cs={cs} />)}
// //           </div>
// //         )}
// //       </div>
// //     </section>
// //   );
// // }

// // function ParohaCard() {
// //   const outcomes = [
// //     { before: '3 days of manual reconciliation', after: 'Automated daily report', stage: 'Automate' },
// //     { before: 'No logistics visibility', after: 'Daily delivery performance dashboard', stage: 'Illuminate' },
// //     { before: 'Manual sales tracking', after: 'Automated pipeline data aggregation', stage: 'Automate' },
// //     { before: 'Manual customer follow-up', after: 'n8n workflow handles all reminders', stage: 'Automate' },
// //   ];
// //   return (
// //     <div style={{ border: '2px solid var(--blue)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
// //       <div style={{ background: 'var(--blue)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
// //         <div>
// //           <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>Production Environment · Live Business · 2024–Present</div>
// //           <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Paroha Investment Limited</div>
// //           <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>Logistics & Sales Operations · Kisumu, Kenya</div>
// //         </div>
// //         <div style={{ display: 'flex', gap: 8 }}>
// //           {['Structure', 'Automate', 'Illuminate'].map(s => (
// //             <span key={s} style={{ fontSize: 10, fontWeight: 800, padding: '4px 11px', background: 'rgba(240,120,35,0.2)', color: 'var(--orange)', borderRadius: 20, border: '1px solid rgba(240,120,35,0.4)', letterSpacing: '0.06em' }}>{s}</span>
// //           ))}
// //         </div>
// //       </div>
// //       <div style={{ padding: '24px 28px' }}>
// //         <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Operational transformations delivered</p>
// //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
// //           {outcomes.map((o, i) => (
// //             <div key={i} style={{ background: 'var(--off)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
// //               <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 20, marginBottom: 10, background: 'var(--blue)', color: '#fff', letterSpacing: '0.07em' }}>{o.stage}</div>
// //               <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6, textDecoration: 'line-through' }}>{o.before}</div>
// //               <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>→ {o.after}</div>
// //             </div>
// //           ))}
// //         </div>
// //         <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 18 }}>
// //           {['SQL', 'n8n', 'Airtable', 'Python', 'Business Intelligence', 'Workflow Automation'].map(t => (
// //             <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', background: 'var(--blue-pale)', color: 'var(--blue)', borderRadius: 20 }}>{t}</span>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // "tittle" is the actual primary field name in the schema (verified)
// function CaseStudyCard({ cs }) {
//   return (
//     <div style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
//       {cs.hero_image_url && (
//         <img src={cs.hero_image_url} alt={cs.tittle || 'Case study'} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
//       )}
//       <div style={{ padding: '20px 20px 16px' }}>
//         <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{cs.client_type}</div>
//         <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--blue)', lineHeight: 1.25, marginBottom: 10 }}>{cs.tittle}</h3>
//         <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 16 }}>
//           <span style={{ textDecoration: 'line-through', color: '#bbb' }}>{cs.problem_state}</span>
//           {cs.outcome_metric && <><span style={{ margin: '0 4px' }}> → </span><strong style={{ color: 'var(--green)' }}>{cs.outcome_metric}</strong></>}
//         </p>
//         {cs.loom_url && (
//           <a href={cs.loom_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)', border: '1.5px solid var(--orange)', padding: '7px 14px', borderRadius: 'var(--radius)', display: 'inline-block' }}>
//             ▶ Watch Walkthrough
//           </a>
//         )}
//       </div>
//     </div>
//   );
// }
