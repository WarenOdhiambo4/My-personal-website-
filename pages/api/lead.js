
const https = require('https');

function httpsPost(url, apiKey, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const payload = JSON.stringify(body);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'waren-portfolio/1.0',
      },
      timeout: 12000,
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`Airtable HTTP ${res.statusCode}: ${data.slice(0, 300)}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(payload);
    req.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, business, problem } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  const BASE_ID = process.env.AIRTABLE_BASE_ID;
  const API_KEY = process.env.AIRTABLE_API_KEY;

  if (!BASE_ID || !API_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    await httpsPost(
      `https://api.airtable.com/v0/${BASE_ID}/Leads`,
      API_KEY,
      {
        fields: {
          name,
          email,
          business: business || '',
          problem_description: problem || '',
          source: 'Portfolio Website',
          status: 'New',
          submitted_at: new Date().toISOString(),
        },
      }
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Lead error:', err.message);
    return res.status(500).json({ error: 'Submission failed: ' + err.message });
  }
}

