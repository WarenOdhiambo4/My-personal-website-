
import { useState, useEffect } from 'react';
import { clientGetSiteConfig } from '../lib/airtable-client';

// Operational scene data — real business environments
const SCENES = [
  {
    id: 'crm',
    label: 'CRM · Pipeline',
    accent: '#F07823',
    rows: [
      { stage: 'Scheduled', count: 12, amount: 'KES 840K', color: '#3B82F6' },
      { stage: 'Won',       count: 8,  amount: 'KES 560K', color: '#10B981' },
      { stage: 'Lost',      count: 3,  amount: 'KES 210K', color: '#EF4444' },
      { stage: 'Pipeline',  count: 24, amount: 'KES 1.68M',color: '#F07823' },
    ],
  },
  {
    id: 'airtable',
    label: 'Airtable · Inventory',
    accent: '#10B981',
    rows: [
      { sku: 'UNG-2KG-001', item: 'Unga Jogoo 2kg',    qty: 248, status: 'OK',      reorder: 50 },
      { sku: 'SUN-B-012',   item: 'Sunlight Bar ×12',  qty: 34,  status: 'REORDER', reorder: 40 },
      { sku: 'IND-40-007',  item: 'Indomie Carton ×40',qty: 0,   status: 'CRITICAL', reorder: 20 },
      { sku: 'TUC-C-004',   item: 'Tuc Biscuits Carton',qty: 91, status: 'OK',      reorder: 30 },
    ],
  },
  {
    id: 'n8n',
    label: 'n8n · Automation',
    accent: '#8B5CF6',
    nodes: [
      { x: 8,  y: 40, label: 'Airtable\nTrigger',   color: '#F07823' },
      { x: 30, y: 22, label: 'Filter\nNew Leads',   color: '#3B82F6' },
      { x: 30, y: 58, label: 'Format\nData',        color: '#3B82F6' },
      { x: 55, y: 40, label: 'Google\nSheets',      color: '#10B981' },
      { x: 77, y: 25, label: 'Send\nEmail',         color: '#8B5CF6' },
      { x: 77, y: 55, label: 'Update\nAirtable',    color: '#F07823' },
    ],
    edges: [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]],
  },
];

function CRMScene() {
  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: 8, height: 8, background: '#10B981', borderRadius: '50%' }} />
        <span style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 10 }}>Sales Pipeline · Live</span>
        <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>Updated 2 min ago</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { stage: 'Scheduled', count: 12, amount: 'KES 840K', color: '#3B82F6', icon: '◷' },
          { stage: 'Won',       count: 8,  amount: 'KES 560K', color: '#10B981', icon: '✓' },
          { stage: 'Lost',      count: 3,  amount: 'KES 210K', color: '#EF4444', icon: '✕' },
          { stage: 'Pipeline',  count: 24, amount: 'KES 1.68M',color: '#F07823', icon: '→' },
        ].map(row => (
          <div key={row.stage} style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${row.color}30`,
            padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ color: row.color, fontSize: 12 }}>{row.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{row.stage}</span>
            </div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{row.count}</div>
            <div style={{ color: row.color, fontSize: 10 }}>{row.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AirtableScene() {
  const rows = [
    { sku: 'UNG-2KG-001', item: 'Unga Jogoo 2kg',     qty: 248, status: 'OK',       },
    { sku: 'SUN-B-012',   item: 'Sunlight Bar ×12',   qty: 34,  status: 'REORDER',  },
    { sku: 'IND-40-007',  item: 'Indomie Carton ×40', qty: 0,   status: 'CRITICAL', },
    { sku: 'TUC-C-004',   item: 'Tuc Biscuits',       qty: 91,  status: 'OK',       },
  ];
  const statusColors = { OK: '#10B981', REORDER: '#F07823', CRITICAL: '#EF4444' };
  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: 8, height: 8, background: '#F07823', borderRadius: '50%' }} />
        <span style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 10 }}>Airtable · Warehouse Inventory</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {['SKU', 'Item', 'Qty', 'Status'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '4px 8px', color: 'rgba(255,255,255,0.3)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{r.sku}</td>
              <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>{r.item}</td>
              <td style={{ padding: '7px 8px', color: '#fff', fontWeight: 700 }}>{r.qty}</td>
              <td style={{ padding: '7px 8px' }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: statusColors[r.status], border: `1px solid ${statusColors[r.status]}40`, padding: '2px 6px', letterSpacing: '0.08em' }}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function N8nScene() {
  const nodes = [
    { x: 5,  y: 38, label: 'Airtable',   sublabel: 'New Record',  color: '#F07823' },
    { x: 32, y: 18, label: 'Filter',     sublabel: 'New Leads',   color: '#3B82F6' },
    { x: 32, y: 58, label: 'Format',     sublabel: 'Data',        color: '#3B82F6' },
    { x: 58, y: 38, label: 'G.Sheets',   sublabel: 'Append Row',  color: '#10B981' },
    { x: 80, y: 20, label: 'Gmail',      sublabel: 'Send Email',  color: '#8B5CF6' },
    { x: 80, y: 56, label: 'Airtable',   sublabel: 'Update',      color: '#F07823' },
  ];
  const edges = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5]];
  const W = 100, H = 80;
  const nodeW = 14, nodeH = 10;

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: 8, height: 8, background: '#8B5CF6', borderRadius: '50%' }} />
        <span style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 10 }}>n8n · Workflow Automation</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 160, overflow: 'visible' }}>
        {/* Edges */}
        {edges.map(([from, to], i) => {
          const f = nodes[from], t = nodes[to];
          const fx = f.x + nodeW/2, fy = f.y + nodeH/2;
          const tx = t.x, ty = t.y + nodeH/2;
          return (
            <g key={i}>
              <line x1={`${fx}%`} y1={`${fy}%`} x2={`${tx}%`} y2={`${ty}%`}
                stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" strokeDasharray="1.5,1.5"/>
              {/* Arrow dot */}
              <circle cx={`${(fx+tx)/2}%`} cy={`${(fy+ty)/2}%`} r="0.8" fill="rgba(255,255,255,0.2)"/>
            </g>
          );
        })}
        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            <rect x={`${n.x}%`} y={`${n.y}%`} width={`${nodeW}%`} height={`${nodeH}%`}
              fill={n.color + '18'} stroke={n.color + '80'} strokeWidth="0.6"/>
            <text x={`${n.x + nodeW/2}%`} y={`${n.y + nodeH/2 - 0.5}%`}
              textAnchor="middle" dominantBaseline="middle"
              fill="#fff" fontSize="2.8" fontFamily="IBM Plex Mono" fontWeight="600">
              {n.label}
            </text>
            <text x={`${n.x + nodeW/2}%`} y={`${n.y + nodeH/2 + 2.5}%`}
              textAnchor="middle" dominantBaseline="middle"
              fill={n.color} fontSize="2.2" fontFamily="IBM Plex Mono">
              {n.sublabel}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function OperationalHero({ config: serverConfig = {} }) {
  const [config, setConfig] = useState(serverConfig);
  const [activeScene, setActiveScene] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    clientGetSiteConfig().then(c => {
      if (Object.keys(c).length) setConfig(prev => ({ ...prev, ...c }));
    }).catch(() => {});
    // Rotate scenes every 4 seconds
    const timer = setInterval(() => setActiveScene(s => (s + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  const profileImg = mounted ? (config.profile_image_url || '') : '';
  const sceneLabels = ['CRM · Pipeline', 'Inventory · Airtable', 'n8n · Automation'];

  return (
    <section style={{
      background: '#0A1428',
      minHeight: '92vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative',
    }} className="op-hero">
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Orange top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#F07823', zIndex: 10 }} />

      {/* LEFT — operational scene */}
      <div style={{ padding: '80px 48px 80px 64px', position: 'relative', zIndex: 2 }}>
        {/* Scene switcher tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {sceneLabels.map((label, i) => (
            <button key={i} onClick={() => setActiveScene(i)} style={{
              padding: '8px 16px', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: "'IBM Plex Mono', monospace",
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeScene === i ? '2px solid #F07823' : '2px solid transparent',
              color: activeScene === i ? '#F07823' : 'rgba(255,255,255,0.3)',
              marginBottom: -1, transition: 'color 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Scene panel */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '24px',
          minHeight: 240,
          position: 'relative',
        }}>
          {activeScene === 0 && <CRMScene />}
          {activeScene === 1 && <AirtableScene />}
          {activeScene === 2 && <N8nScene />}
        </div>

        {/* Proof line */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.06em' }}>
            Live systems · Paroha Investment Limited · Kisumu
          </span>
        </div>
      </div>

      {/* RIGHT — headline + floating profile */}
      <div style={{ padding: '80px 64px 80px 48px', position: 'relative', zIndex: 2 }}>
        {/* Floating profile image — supporting element only */}
        {profileImg && (
          <div style={{
            position: 'absolute', top: 40, right: 48,
            width: 56, height: 56,
            border: '2px solid rgba(240,120,35,0.4)',
            overflow: 'hidden',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profileImg} alt="Waren Odhiambo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          </div>
        )}

        {/* System tag */}
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10, fontWeight: 600,
          color: '#F07823', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 24,
        }}>
          Operational Infrastructure Design
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(32px, 3.5vw, 52px)',
          fontWeight: 900, color: '#fff',
          lineHeight: 1.05, letterSpacing: '-0.03em',
          marginBottom: 24,
        }}>
          Businesses run<br />
          <span style={{ color: '#F07823' }}>on systems.</span><br />
          Not memory.
        </h1>

        {/* Sub */}
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 40, maxWidth: 380 }}>
          When the founder becomes the bottleneck, the business stops scaling. The systems below remove that dependency.
        </p>

        {/* Three pillars — sharp enterprise style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { label: 'Structure', desc: 'Database architecture. One source of truth.' },
            { label: 'Automate', desc: 'Workflow logic. Data triggers action.' },
            { label: 'Illuminate', desc: 'Dashboards. Decisions from data.' },
          ].map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 28, height: 28, background: 'rgba(240,120,35,0.12)',
                border: '1px solid rgba(240,120,35,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#F07823',
                fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0,
              }}>0{i+1}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .op-hero { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

