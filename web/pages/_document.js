import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        {/* ── Temel SEO ── */}
        <meta charSet="utf-8" />
        <meta name="description" content="Rezonans Sanat ve Kişisel Gelişim Merkezi Etimesgut — Müzik, resim, dans ve akıl oyunları kursları. Etimesgut'un en kapsamlı sanat okulu." />
        <meta name="keywords" content="Rezonans, Rezonans Etimesgut, Rezonans Sanat, Rezonans Eğitim, Rezonans Sanat Merkezi, Etimesgut sanat okulu, Etimesgut müzik kursu, Etimesgut dans kursu, Etimesgut resim kursu, sanat merkezi Etimesgut, kişisel gelişim Etimesgut, Ankara sanat okulu, müzik dersleri Etimesgut" />
        <meta name="author" content="Rezonans Sanat ve Kişisel Gelişim Merkezi" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://rezonansetimesgut.com.tr/" />

        {/* ── Open Graph (WhatsApp, Facebook, LinkedIn paylaşımları) ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rezonansetimesgut.com.tr/" />
        <meta property="og:title" content="Rezonans Sanat ve Kişisel Gelişim Merkezi | Etimesgut" />
        <meta property="og:description" content="Etimesgut'ta müzik, resim, dans ve akıl oyunları kursları. Rezonans Sanat Merkezi ile çocuğunuzun yeteneklerini keşfedin." />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content="Rezonans Etimesgut" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Rezonans Sanat ve Kişisel Gelişim Merkezi | Etimesgut" />
        <meta name="twitter:description" content="Etimesgut'ta müzik, resim, dans ve akıl oyunları kursları." />

        {/* ── Favicon ── */}
        <link rel="icon" href="/favicon.ico" />

        {/* ── Mobil & PWA ── */}
        <meta name="theme-color" content="#581c87" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Rezonans" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* ── Google için yapılandırılmış veri (LocalBusiness) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Rezonans Sanat ve Kişisel Gelişim Merkezi",
              "alternateName": ["Rezonans Etimesgut", "Rezonans Sanat", "Rezonans Eğitim"],
              "url": "https://rezonansetimesgut.com.tr",
              "description": "Etimesgut'ta müzik, resim, dans ve akıl oyunları kursları sunan sanat ve kişisel gelişim merkezi.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Etimesgut",
                "addressRegion": "Ankara",
                "addressCountry": "TR"
              },
              "areaServed": "Etimesgut, Ankara",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Kurslar",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Müzik Kursları" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Resim Kursları" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Dans Kursları" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Akıl Oyunları" } }
                ]
              }
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
