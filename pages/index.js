import Head from 'next/head';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Process from '../components/Process';
import CaseStudies from '../components/CaseStudies';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
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
        <meta property="og:type" content="website" />
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
