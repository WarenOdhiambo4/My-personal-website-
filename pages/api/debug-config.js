// pages/api/debug-config.js
// DELETE THIS FILE after confirming the image URL is correct
// Visit: http://localhost:3000/api/debug-config to see what Airtable returns

export default async function handler(req, res) {
  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const API_KEY = process.env.AIRTABLE_API_KEY;

  if (!BASE_ID || !API_KEY) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  const https = require('https');

  function get(url) {
    return new Promise((resolve, reject) => {
      const parsed = new URL(url);
      const req = https.request({
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers: { Authorization: `Bearer ${API_KEY}` },
        timeout: 10000,
      }, (r) => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => {
          try { resolve(JSON.parse(d)); }
          catch { resolve({ raw: d.slice(0, 500) }); }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      req.end();
    });
  }

  try {
    const data = await get(`https://api.airtable.com/v0/${BASE_ID}/Site%20Config`);
    const config = (data.records || []).reduce((acc, r) => {
      if (r.fields?.config_key) acc[r.fields.config_key] = r.fields.config_value || '';
      return acc;
    }, {});
    return res.status(200).json({
      raw_record_count: data.records?.length || 0,
      parsed_config: config,
      profile_image_url: config.profile_image_url || 'NOT FOUND',
      calendly_url: config.calendly_url || 'NOT FOUND',
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
