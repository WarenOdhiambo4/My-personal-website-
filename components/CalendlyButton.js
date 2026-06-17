
// Opens Calendly as a popup overlay — no page redirect, no lost scroll position
import { useEffect, useState } from 'react';

export default function CalendlyButton({ url, children, style = {}, className = '' }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Inject Calendly widget script once
    if (document.getElementById('calendly-script')) {
      setLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'calendly-script';
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);

    // Inject Calendly CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);
  }, []);

  function openCalendly(e) {
    e.preventDefault();
    if (!url || url === '#') {
      alert('Calendly URL not configured yet.\nAdd it to Airtable → Site Config → calendly_url');
      return;
    }
    if (loaded && window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    } else {
      // Fallback: open in new tab if popup script not ready
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <button onClick={openCalendly} style={style} className={className}>
      {children}
    </button>
  );
}