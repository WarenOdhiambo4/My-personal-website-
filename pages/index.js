// pages/index.js
import Head from 'next/head';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Process from '../components/Process';
import CaseStudies from '../components/CaseStudies';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { getSiteConfig, getCaseStudies, getTestimonials } from '../lib/airtable';

export default function Home({ config, caseStudies, testimonials }) {
  return (
    <>
      <Head>
        <title>Waren Odhiambo — Operational Infrastructure Builder</title>
        <meta name="description" content="I build operational infrastructure for businesses that have outgrown their spreadsheets. Structure → Automate → Illuminate. Based in Nairobi, Kenya. Remote worldwide." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="Waren Odhiambo — Operational Infrastructure Builder" />
        <meta property="og:description" content="The founder stops being the system. The business starts running on one. Structure → Automate → Illuminate." />
        <meta property="og:type" content="website" />
        {config.profile_image_url && (
          <meta property="og:image" content={config.profile_image_url} />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Waren Odhiambo — Operational Infrastructure Builder" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav config={config} />
      <main>
        <Hero config={config} />
        <Process />
        <CaseStudies caseStudies={caseStudies} />
        {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
        <About config={config} />
        <CTA config={config} />
      </main>
      <Footer />
    </>
  );
}

// ─── SERVER-SIDE DATA FETCH ──────────────────────────────────────
// Runs at build time (SSG) for speed, revalidates every 60 seconds (ISR)
export async function getStaticProps() {
  let config = {};
  let caseStudies = [];
  let testimonials = [];

  try {
    config = await getSiteConfig();
  } catch (e) {
    console.warn('getSiteConfig failed:', e.message);
  }

  try {
    caseStudies = await getCaseStudies();
  } catch (e) {
    console.warn('getCaseStudies failed:', e.message);
  }

  try {
    testimonials = await getTestimonials();
  } catch (e) {
    console.warn('getTestimonials failed:', e.message);
  }

  return {
    props: { config, caseStudies, testimonials },
    revalidate: 60, // ISR: rebuild every 60 seconds if requested
  };
}
