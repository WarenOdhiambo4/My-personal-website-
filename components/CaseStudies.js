import { useState, useEffect } from 'react';
import { clientGetCaseStudies } from '../lib/airtable-client';

export default function CaseStudies({ caseStudies: serverData = [] }) {
  const [caseStudies, setCaseStudies] = useState(serverData);

  useEffect(() => {
    if (!serverData.length) {
      clientGetCaseStudies().then(d => { if (d.length) setCaseStudies(d); });
    }
  }, []);

  return (
    <section id="work" style={{ padding: '96px 32px', background: 'var(--white)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 2, background: 'var(--orange)' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>Case Studies</span>
        </div>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: 'var(--blue)', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 40 }}>
          Production work.<br />Real operational environments.
        </h2>

//         {/* Paroha — always shown first */}
//         <ParohaCard />

//         {caseStudies.length > 0 && (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20, marginTop: 20 }}>
//             {caseStudies.map(cs => <CaseStudyCard key={cs.id} cs={cs} />)}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// function ParohaCard() {
//   const outcomes = [
//     { before: '3 days of manual reconciliation', after: 'Automated daily report', stage: 'Automate' },
//     { before: 'No logistics visibility', after: 'Daily delivery performance dashboard', stage: 'Illuminate' },
//     { before: 'Manual sales tracking', after: 'Automated pipeline data aggregation', stage: 'Automate' },
//     { before: 'Manual customer follow-up', after: 'n8n workflow handles all reminders', stage: 'Automate' },
//   ];
//   return (
//     <div style={{ border: '2px solid var(--blue)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20 }}>
//       <div style={{ background: 'var(--blue)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
//         <div>
//           <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>Production Environment · Live Business · 2024–Present</div>
//           <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Paroha Investment Limited</div>
//           <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>Logistics & Sales Operations · Kisumu, Kenya</div>
//         </div>
//         <div style={{ display: 'flex', gap: 8 }}>
//           {['Structure', 'Automate', 'Illuminate'].map(s => (
//             <span key={s} style={{ fontSize: 10, fontWeight: 800, padding: '4px 11px', background: 'rgba(240,120,35,0.2)', color: 'var(--orange)', borderRadius: 20, border: '1px solid rgba(240,120,35,0.4)', letterSpacing: '0.06em' }}>{s}</span>
//           ))}
//         </div>
//       </div>
//       <div style={{ padding: '24px 28px' }}>
//         <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Operational transformations delivered</p>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
//           {outcomes.map((o, i) => (
//             <div key={i} style={{ background: 'var(--off)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
//               <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 20, marginBottom: 10, background: 'var(--blue)', color: '#fff', letterSpacing: '0.07em' }}>{o.stage}</div>
//               <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6, textDecoration: 'line-through' }}>{o.before}</div>
//               <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>→ {o.after}</div>
//             </div>
//           ))}
//         </div>
//         <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 18 }}>
//           {['SQL', 'n8n', 'Airtable', 'Python', 'Business Intelligence', 'Workflow Automation'].map(t => (
//             <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', background: 'var(--blue-pale)', color: 'var(--blue)', borderRadius: 20 }}>{t}</span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// "tittle" is the actual primary field name in the schema (verified)
function CaseStudyCard({ cs }) {
  return (
    <div style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      {cs.hero_image_url && (
        <img src={cs.hero_image_url} alt={cs.tittle || 'Case study'} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
      )}
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{cs.client_type}</div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--blue)', lineHeight: 1.25, marginBottom: 10 }}>{cs.tittle}</h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 16 }}>
          <span style={{ textDecoration: 'line-through', color: '#bbb' }}>{cs.problem_state}</span>
          {cs.outcome_metric && <><span style={{ margin: '0 4px' }}> → </span><strong style={{ color: 'var(--green)' }}>{cs.outcome_metric}</strong></>}
        </p>
        {cs.loom_url && (
          <a href={cs.loom_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)', border: '1.5px solid var(--orange)', padding: '7px 14px', borderRadius: 'var(--radius)', display: 'inline-block' }}>
            ▶ Watch Walkthrough
          </a>
        )}
      </div>
    </div>
  );
}
