const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;

async function fetchTable(tableName, params = '') {
  if (!BASE_ID || !API_KEY) return { records: [] };
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}${params}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    if (!res.ok) { console.warn('[AT]', tableName, res.status); return { records: [] }; }
    return res.json();
  } catch (e) { console.warn('[AT] error:', e.message); return { records: [] }; }
}

// Site Config: config_key, config_value, label, last_updated
export async function clientGetSiteConfig() {
  const data = await fetchTable('Site Config');
  return data.records.reduce((acc, r) => {
    if (r.fields?.config_key) acc[r.fields.config_key] = r.fields.config_value || '';
    return acc;
  }, {});
}

export async function clientGetCaseStudies() {
  const data = await fetchTable(
    'Case Studies',
    '?filterByFormula={published}=1&sort[0][field]=published_date&sort[0][direction]=desc'
  );
  return data.records.map(r => ({ id: r.id, ...r.fields }));
}


export async function clientGetTestimonials() {
  const data = await fetchTable('Testimonials', '?filterByFormula={permission_granted}=1');
  return data.records.map(r => ({ id: r.id, ...r.fields }));
}
export async function clientSubmitLead({ Name, email, business, problem_description }) {
  if (!BASE_ID || !API_KEY) throw new Error('Missing Airtable client env vars');
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/Leads`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          Name,
          email,
          business,
          problem_description,
          source: 'Portfolio Website',
          submitted_at: new Date().toISOString(),
        }
      })
    }
  );
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  return res.json();
}



<<<<<<< HEAD

// const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
// const API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;

// async function fetchTable(tableName, params = '') {
//   if (!BASE_ID || !API_KEY) {
//     console.warn('[Airtable client] Missing NEXT_PUBLIC_ env vars');
//     return { records: [] };
//   }
//   const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}${params}`;
//   try {
//     const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
//     if (!res.ok) { console.warn('[Airtable client]', tableName, res.status); return { records: [] }; }
//     return res.json();
//   } catch (e) {
//     console.warn('[Airtable client] fetch error:', e.message);
//     return { records: [] };
//   }
// }

// // Site Config — fields: config_key, config_value, label, last_updated
// export async function clientGetSiteConfig() {
//   const data = await fetchTable('Site Config');
//   return data.records.reduce((acc, r) => {
//     if (r.fields?.config_key) acc[r.fields.config_key] = r.fields.config_value || '';
//     return acc;
//   }, {});
// }

// // Case Studies — primary field: "tittle" (verified spelling in schema)
// // fields: tittle, slug, client_type, problem_state, system_built, outcome_metric,
// //         pipeline_stages, loom_url, hero_image_url, tools_used, published_date, published
// export async function clientGetCaseStudies() {
//   const data = await fetchTable(
//     'Case Studies',
//     '?filterByFormula={published}=1&sort[0][field]=published_date&sort[0][direction]=desc'
//   );
//   return data.records.map(r => ({ id: r.id, ...r.fields }));
// }

// // Testimonials — primary field: "Name"
// // fields: Name, role, business, quote, permission_granted, contains_metric, date_received
// export async function clientGetTestimonials() {
//   const data = await fetchTable('Testimonials', '?filterByFormula={permission_granted}=1');
//   return data.records.map(r => ({ id: r.id, ...r.fields }));
// }

// // Leads — exact fields from schema:
// // Name (primary), email, business, problem_description, source, submitted_at,
// // discovery_call_date, proposal_amount_kes, proposal_sent_date, follow_up_date,
// // days_since_contact (formula), lost_reason, converted_project, notes
// // NOTE: NO "status" field exists in Leads table — do not send it
// export async function clientSubmitLead({ Name, email, business, problem_description }) {
//   if (!BASE_ID || !API_KEY) throw new Error('Missing Airtable client env vars');
//   const res = await fetch(
//     `https://api.airtable.com/v0/${BASE_ID}/Leads`,
//     {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         fields: {
//           Name,                  // capital N — primary field
//           email,
//           business,
//           problem_description,
//           source: 'Portfolio Website',
//           submitted_at: new Date().toISOString(),
//         },
//       }),
//     }
//   );
//   if (!res.ok) {
//     const err = await res.text();
//     throw new Error(err);
//   }
//   return res.json();
// }
=======
>>>>>>> 31de815 (add new file entrypage)
