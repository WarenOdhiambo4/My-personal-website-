// pages/index.js
import Head from 'next/head';
import Nav from '../components/Nav';
import EntryGate from '../components/EntryGate';
import Hero from '../components/Hero';
import Process from '../components/Process';
import CaseStudies from '../components/CaseStudies';
import About from '../components/About';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
const { getSiteConfig, getCaseStudies, getTestimonials } = require('../lib/airtable');

export default function Home({ config, caseStudies, testimonials }) {
  return (
    <>
      <Head>
        <title>Waren Odhiambo — Operational Infrastructure Builder</title>
        <meta name="description" content="I build operational infrastructure for businesses that have outgrown their spreadsheets. Structure → Automate → Illuminate. Nairobi, Kenya." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Waren Odhiambo — Operational Infrastructure Builder" />
        <meta property="og:description" content="The founder stops being the system. The business starts running on one." />
        {config.profile_image_url && <meta property="og:image" content={config.profile_image_url} />}
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NEW: Entry gate playground — shown first, dismissed to reveal site */}
      <EntryGate config={config} />

      {/* ORIGINAL SITE — unchanged */}
      <Nav config={config} />
      <main>
        <Hero config={config} />
        <Process />
        <CaseStudies caseStudies={caseStudies} testimonials={testimonials} />
        <About config={config} />
        <CTA config={config} />
      </main>
      <Footer config={config} />
    </>
  );
}

export async function getStaticProps() {
  let config = {}, caseStudies = [], testimonials = [];
  try { config = await getSiteConfig(); } catch (e) { console.warn('getSiteConfig:', e.message); }
  try { caseStudies = await getCaseStudies(); } catch (e) { console.warn('getCaseStudies:', e.message); }
  try { testimonials = await getTestimonials(); } catch (e) { console.warn('getTestimonials:', e.message); }
  return { props: { config, caseStudies, testimonials }, revalidate: 60 };
}



// pages/index.js
import Head from 'next/head';
import Nav from '../components/Nav';
import EntryGate from '../components/EntryGate';
import Hero from '../components/Hero';
import Process from '../components/Process';
import CaseStudies from '../components/CaseStudies';
import About from '../components/About';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
const { getSiteConfig, getCaseStudies, getTestimonials } = require('../lib/airtable');

export default function Home({ config, caseStudies, testimonials }) {
  return (
    <>
      <Head>
        {/* STEP 2 KEY: Google Ownership Verification */}
        <meta name="google-site-verification" content="vxW0LptrLuDeUS3CQP0BfYRungRoqu5ybULSCMqhfgs" />

        {/* SEO TARGETING: Airtable Infrastructure & Next.js Developer Keywords */}
        <title>Waren Odhiambo | Airtable Infrastructure & Next.js Developer</title>
        <meta name="description" content="I build operational infrastructure for businesses that have outgrown their spreadsheets. Custom Airtable automation systems and Next.js databases. Nairobi, Kenya." />
        <meta name="keywords" content="Airtable developer, Airtable automation expert, Next.js workflow systems, Operational infrastructure builder, Waren Odhiambo portfolio, low code systems builder" />
        <meta name="robots" content="index, follow" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Waren Odhiambo | Airtable Infrastructure & Next.js Developer" />
        <meta property="og:description" content="The founder stops being the system. Custom Airtable pipelines built on Next.js architectures." />
        {config.profile_image_url && <meta property="og:image" content={config.profile_image_url} />}
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NEW: Entry gate playground — shown first, dismissed to reveal site */}
      <EntryGate config={config} />

      {/* ORIGINAL SITE — unchanged */}
      <Nav config={config} />
      <main>
        <Hero config={config} />
        <Process />
        <CaseStudies caseStudies={caseStudies} testimonials={testimonials} />
        <About config={config} />
        <CTA config={config} />
      </main>
      <Footer config={config} />
    </>
  );
}

export async function getStaticProps() {
  let config = {}, caseStudies = [], testimonials = [];
  try { config = await getSiteConfig(); } catch (e) { console.warn('getSiteConfig:', e.message); }
  try { caseStudies = await getCaseStudies(); } catch (e) { console.warn('getCaseStudies:', e.message); }
  try { testimonials = await getTestimonials(); } catch (e) { console.warn('getTestimonials:', e.message); }
  return { props: { config, caseStudies, testimonials }, revalidate: 60 };
}
