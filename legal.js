// pages/index.js
// Nebenkostencheck.de / Betriebskostencheck.online
// Brand + Meta Tags wechseln per Domain/IP automatisch in der App

import dynamic from "next/dynamic";
import Head from "next/head";

const App = dynamic(() => import("../hektagon"), { ssr: false });

// Meta-Daten per Domain anpassen
function getMeta() {
  if (typeof window === "undefined") {
    // Server-side: default zu DE
    return {
      title: "Nebenkostencheck — Stimmt Deine Nebenkostenabrechnung?",
      desc:  "Prüfe deine Nebenkostenabrechnung in unter 60 Sekunden. KI-Analyse nach BGB §556. 93% aller Abrechnungen enthalten Fehler.",
      url:   "https://nebenkostencheck.de",
      brand: "Nebenkostencheck",
    };
  }
  const host = window.location.hostname;
  if (host.includes("betriebskostencheck")) {
    return {
      title: "Betriebskostencheck — Stimmt Deine Betriebskostenabrechnung?",
      desc:  "Prüfe deine Betriebskostenabrechnung in unter 60 Sekunden. KI-Analyse nach MRG §21-24 (AT) und OR Art. 257a (CH).",
      url:   `https://${host}`,
      brand: "Betriebskostencheck",
    };
  }
  return {
    title: "Nebenkostencheck — Stimmt Deine Nebenkostenabrechnung?",
    desc:  "Prüfe deine Nebenkostenabrechnung in unter 60 Sekunden. KI-Analyse nach BGB §556. 93% aller Abrechnungen enthalten Fehler.",
    url:   "https://nebenkostencheck.de",
    brand: "Nebenkostencheck",
  };
}

export default function Home() {
  const meta = getMeta();

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title"       content={meta.title} />
        <meta property="og:description" content={meta.desc} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={meta.url} />
        <meta property="og:image"       content={`${meta.url}/og-image.png`} />

        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={meta.title} />
        <meta name="twitter:description" content={meta.desc} />

        {/* Canonical — wichtig für SEO wenn mehrere Domains */}
        <link rel="canonical" href={meta.url} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App />
    </>
  );
}
