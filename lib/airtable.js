
const https = require('https');

function getCredentials() {
  return { BASE_ID: process.env.AIRTABLE_BASE_ID, API_KEY: process.env.AIRTABLE_API_KEY };
}

function httpsGet(url, apiKey) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}`, 'User-Agent': 'waren-portfolio/1.0' },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) { console.warn(`[Airtable] HTTP ${res.statusCode}`); resolve({ records: [] }); return; }
        try { resolve(JSON.parse(data)); } catch { resolve({ records: [] }); }
      });
    });
    req.on('error', e => { console.warn('[Airtable] server error:', e.message); resolve({ records: [] }); });
    req.on('timeout', () => { req.destroy(); resolve({ records: [] }); });
    req.end();
  });
}

async function fetchTable(tableName, params = '') {
  const { BASE_ID, API_KEY } = getCredentials();
  if (!BASE_ID || !API_KEY) { console.warn('[Airtable] Missing env vars'); return { records: [] }; }
  return httpsGet(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}${params}`, API_KEY);
}

// Site Config: config_key, config_value, label, last_updated
async function getSiteConfig() {
  const data = await fetchTable('Site Config');
  return data.records.reduce((acc, r) => {
    if (r.fields?.config_key) acc[r.fields.config_key] = r.fields.config_value || '';
    return acc;
  }, {});
}

// Case Studies: tittle (primary — note spelling), slug, client_type, problem_state,
// system_built, outcome_metric, loom_url, hero_image_url, tools_used, published_date, published
async function getCaseStudies() {
  const data = await fetchTable('Case Studies',
    '?filterByFormula={published}=1&sort[0][field]=published_date&sort[0][direction]=desc');
  return data.records.map(r => ({ id: r.id, ...r.fields }));
}

// Testimonials: Name (primary), role, business, quote, permission_granted
async function getTestimonials() {
  const data = await fetchTable('Testimonials', '?filterByFormula={permission_granted}=1');
  return data.records.map(r => ({ id: r.id, ...r.fields }));
}

module.exports = { getSiteConfig, getCaseStudies, getTestimonials };


