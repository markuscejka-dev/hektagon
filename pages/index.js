// pages/index.js
// Hektagon — Haupt-Einstiegspunkt
// Die App läuft komplett client-side (PDF-Verarbeitung, Claude API, Supabase)

import dynamic from "next/dynamic";
import Head from "next/head";

// Dynamic import verhindert SSR-Fehler (FileReader, window etc. existieren nur im Browser)
const App = dynamic(() => import("../hektagon"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Hektagon — Stimmt Deine Nebenkostenabrechnung?</title>
        <meta
          name="description"
          content="Prüfe deine Nebenkostenabrechnung in unter 60 Sekunden. KI-Analyse nach BGB §556. 93% aller Abrechnungen enthalten Fehler – durchschnittlich €515 zu viel."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph – für WhatsApp, Twitter, LinkedIn Vorschau */}
        <meta property="og:title" content="Hektagon — Stimmt Deine Nebenkostenabrechnung?" />
        <meta property="og:description" content="KI prüft deine Abrechnung in 60 Sekunden. Kostenlos. Für DE, AT & CH." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hektagon.de" />
        <meta property="og:image" content="https://hektagon.de/og-image.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App />
    </>
  );
}
