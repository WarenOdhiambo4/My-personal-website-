// components/CaseStudies.js
// Enterprise case study cards: sharp edges, Roman numeral outcomes,
// horizontal layout, floating testimonial, no Before section

import { useState, useEffect } from 'react';
import { clientGetCaseStudies, clientGetTestimonials } from '../lib/airtable-client';

export default function CaseStudies({ caseStudies: serverData = [], testimonials: serverTestimonials = [] }) {
  const [caseStudies, setCaseStudies] = useState(serverData);
  const [testimonials, setTestimonials] = useState(serverTestimonials);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    clientGetCaseStudies().then(d => { if (d.length) setCaseStudies(d); }).catch(() => {});
    clientGetTestimonials().then(d => { if (d.length) setTestimonials(d); }).catch(() => {});
  }, []);

  // Match testimonials to case studies by project_name lookup
  const testimonialByProject = testimonials.reduce((acc, t) => {
    const names = t['project_name (from linked_projects)'];
    const arr = Array.isArray(names) ? names : (names ? [names] : []);
    arr.forEach(n => { if (!acc[n]) acc[n] = t; });
    return acc;
  }, {});

  return (
    <section id="work" style={{
      background: '#F7F6F3',
      padding: '96px 0',
      borderTop: '3px solid #0C2151',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 64px' }}>
        {/* Section header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'end', marginBottom: 56 }}>
          <div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10, fontWeight: 600, color: '#F07823',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginBottom: 16,
            }}>
              Case Studies · Operational Transformations
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3vw, 42px)',
              fontWeight: 900, color: '#0C2151',
              lineHeight: 1.05, letterSpacing: '-0.025em',
            }}>
              What changes when<br />infrastructure exists.
            </h2>
          </div>
          <p style={{ fontSize: 15, color: '#5a6880', lineHeight: 1.75, maxWidth: 420, alignSelf: 'end' }}>
            Each engagement below represents a specific operational gap — and the system built to close it.
            No before section. Only measurable outcomes.
          </p>
        </div>

        {/* Cards */}
        {!mounted || !caseStudies.length ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {caseStudies.map((cs, idx) => {
              const projectName = Array.isArray(cs['project_name (from linked_project)'])
                ? cs['project_name (from linked_project)'][0]
                : cs['project_name (from linked_project)'];
              const testimonial = projectName ? testimonialByProject[projectName] : null;
              return <CaseStudyCard key={cs.id} cs={cs} testimonial={testimonial} index={idx} />;
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '64px', border: '1px solid #D8D2C8', background: '#fff', textAlign: 'center' }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#5a6880', marginBottom: 8 }}>
        NO PUBLISHED CASE STUDIES
      </div>
      <div style={{ fontSize: 13, color: '#5a6880' }}>
        Add a record to Airtable → Case Studies → check "published" → it appears here.
      </div>
    </div>
  );
}

// Parse outcomes from outcome_metric string into array
function parseOutcomes(str) {
  if (!str) return [];
  // Split on checkmarks, bullets, newlines, or numbered patterns
  return str
    .split(/[✓•\n]+/)
    .map(s => s.replace(/^[\s\d.·\-→]+/, '').trim())
    .filter(s => s.length > 6)
    .slice(0, 8);
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

function CaseStudyCard({ cs, testimonial, index }) {
  const [hovered, setHovered] = useState(false);

  const title       = cs.tittle || cs.title || '';
  const clientType  = cs.client_type || (Array.isArray(cs['client_type (from linked_project)']) ? cs['client_type (from linked_project)'][0] : '') || '';
  const clientName  = Array.isArray(cs['client_name (from linked_project)']) ? cs['client_name (from linked_project)'][0] : cs['client_name (from linked_project)'] || '';
  const outcomes    = parseOutcomes(cs.outcome_metric);
  const systemBuilt = cs.system_built || '';
  const tools       = Array.isArray(cs.tools_used) ? cs.tools_used : [];
  const stages      = Array.isArray(cs.pipeline_stages) ? cs.pipeline_stages : [];
  const loomUrl     = cs.loom_url || '';
  const heroImg     = cs.hero_image_url || '';

  // Split outcomes into two columns
  const half = Math.ceil(outcomes.length / 2);
  const col1 = outcomes.slice(0, half);
  const col2 = outcomes.slice(half);

  const STAGE_COLORS = {
    Structure:  { bg: '#EEF2FA', color: '#0C2151' },
    Automate:   { bg: '#FFF5ED', color: '#C85A00' },
    Illuminate: { bg: '#EAF7F1', color: '#1A5C2A' },
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '1px solid #D8D2C8',
        borderLeft: '4px solid #0C2151',
        transition: 'border-left-color 0.15s, box-shadow 0.2s',
        borderLeftColor: hovered ? '#F07823' : '#0C2151',
        boxShadow: hovered ? '0 4px 24px rgba(12,33,81,0.08)' : 'none',
        position: 'relative',
      }}
    >
      {/* Card top bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: heroImg ? '280px 1fr' : '1fr',
        minHeight: heroImg ? 200 : 'auto',
        borderBottom: '1px solid #EDE8E0',
      }}>
        {/* Hero image */}
        {heroImg && (
          <div style={{ overflow: 'hidden', borderRight: '1px solid #EDE8E0', position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImg} alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(20%)' }} />
            {/* Stage pills over image */}
            <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 5 }}>
              {stages.map(s => {
                const c = STAGE_COLORS[s] || { bg: '#eee', color: '#333' };
                return (
                  <span key={s} style={{
                    fontSize: 9, fontWeight: 800, padding: '3px 8px',
                    background: c.bg, color: c.color,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>{s}</span>
                );
              })}
            </div>
          </div>
        )}

        {/* Card header info */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, fontWeight: 600, color: '#F07823',
                letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>{clientType}</span>
              {clientName && (
                <>
                  <span style={{ color: '#D8D2C8' }}>·</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#5a6880', letterSpacing: '0.06em' }}>
                    {clientName}
                  </span>
                </>
              )}
              {/* Case number */}
              <span style={{
                marginLeft: 'auto',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, color: '#B8B0A4',
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3 style={{
              fontSize: 'clamp(18px, 1.8vw, 24px)',
              fontWeight: 900, color: '#0C2151',
              lineHeight: 1.15, letterSpacing: '-0.02em',
              marginBottom: 16,
            }}>{title}</h3>

            {/* Stage pills (when no hero image) */}
            {!heroImg && stages.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {stages.map(s => {
                  const c = STAGE_COLORS[s] || { bg: '#eee', color: '#333' };
                  return (
                    <span key={s} style={{
                      fontSize: 9, fontWeight: 800, padding: '3px 10px',
                      background: c.bg, color: c.color,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}>{s}</span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tool tags */}
          {tools.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tools.map(t => (
                <span key={t} style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 10px',
                  background: '#EEF2FA', color: '#0C2151',
                  fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.04em',
                }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* OUTCOMES — Roman numerals, two columns */}
      {outcomes.length > 0 && (
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #EDE8E0' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, fontWeight: 700, color: '#B8B0A4',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Measurable Outcomes
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 32px' }} className="outcomes-grid">
            {outcomes.map((outcome, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #F0ECE6' }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10, fontWeight: 800, color: '#F07823',
                  flexShrink: 0, minWidth: 24, marginTop: 1,
                }}>{ROMAN[i]}</span>
                <span style={{ fontSize: 13, color: '#0e1824', lineHeight: 1.45, fontWeight: 600 }}>{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM BUILT */}
      {systemBuilt && (
        <div style={{ padding: '16px 32px', borderBottom: '1px solid #EDE8E0', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, fontWeight: 700, color: '#B8B0A4',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginTop: 2, flexShrink: 0, width: 100,
          }}>System Built</div>
          <p style={{ fontSize: 13, color: '#5a6880', lineHeight: 1.6, margin: 0 }}>{systemBuilt}</p>
        </div>
      )}

      {/* TESTIMONIAL — warm beige, floating feel, bottom of card */}
      {testimonial && testimonial.quote && (
        <FloatingTestimonial testimonial={testimonial} />
      )}

      {/* CARD FOOTER */}
      <div style={{
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#FAFAF8',
      }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#B8B0A4' }}>
          Delivered · Operational
        </div>
        {loomUrl && (
          <a href={loomUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 12, fontWeight: 800, color: '#0C2151',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            fontFamily: "'IBM Plex Mono', monospace",
            borderBottom: '1px solid #0C2151',
            paddingBottom: 1,
            transition: 'color 0.15s, border-color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F07823'; e.currentTarget.style.borderColor = '#F07823'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#0C2151'; e.currentTarget.style.borderColor = '#0C2151'; }}
          >
            ▶ Watch System Walkthrough
          </a>
        )}
      </div>

      <style>{`
        @media(max-width:720px){
          .outcomes-grid{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}

function FloatingTestimonial({ testimonial }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame;
    let start = null;
    function animate(ts) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      setOffset(Math.sin(t * 0.6) * 4);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const imageUrl = testimonial.image_url || '';
  const initials = testimonial.Name ? testimonial.Name[0].toUpperCase() : '?';

  return (
    <div style={{
      margin: '0 32px 0',
      padding: '20px 24px',
      background: '#F5EFE6',
      borderLeft: '3px solid #F07823',
      transform: `translateY(${offset}px)`,
      transition: 'transform 0.05s linear',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 12, right: 18,
        fontSize: 48, color: '#F07823', opacity: 0.15,
        lineHeight: 1, fontFamily: 'serif', fontWeight: 900,
        pointerEvents: 'none',
      }}>"</div>

      <p style={{
        fontSize: 14, fontWeight: 700, color: '#0C2151',
        lineHeight: 1.7, fontStyle: 'italic',
        marginBottom: 16, paddingRight: 32,
      }}>
        "{typeof testimonial.quote === 'string' ? testimonial.quote : ''}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Client image or initial */}
        <div style={{
          width: 36, height: 36, flexShrink: 0,
          overflow: 'hidden', border: '2px solid #F07823',
        }}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={testimonial.Name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: '#0C2151', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#fff',
            }}>{initials}</div>
          )}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0C2151' }}>{testimonial.Name}</div>
          <div style={{ fontSize: 11, color: '#5a6880' }}>
            {testimonial.role}{testimonial.business ? ` · ${testimonial.business}` : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
