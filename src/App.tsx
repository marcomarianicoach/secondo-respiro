import React, { useEffect, useState, useRef } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

// ==========================
// Calendly (single source of truth)
// ==========================
const CALENDLY_OSSIGENO = "https://calendly.com/marcomarianicoach/ossigeno-45-gratuito"; // call gratuita
const CALENDLY_SESSION = "https://calendly.com/marcomarianicoach"; // pagina con scelta tipologie
// Video sorgente (se locale, verrà mostrato un avviso)
// Video sorgente (se locale, verrà mostrato un avviso)
const VIDEO_SRC = "/VIDEOLANDING.MP4"; // MP4 H.264/AAC consigliato
const VIDEO_SRC_WEBM = "/VIDEOLANDING.webm"; // opzionale fallback WebM (VP9/Opus) // // 
// Poster inline (nessuna rete); sostituisci con un URL https se vuoi un frame reale
const VIDEO_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#0057FF" offset="0"/><stop stop-color="#7AA2FF" offset="1"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-size="56" fill="#fff" opacity="0.9">Secondo Respiro · Video</text></svg>')}`;

// ==========================
// SEO / Metadati
// ==========================
const SITE_NAME = "Secondo Respiro";
const DEFAULT_TITLE = "Secondo Respiro – Coaching 1:1 contro stress e burnout (online)";
const DEFAULT_DESC =
  "Call gratuita Ossigeno 45’: valutiamo se posso esserti utile su stress da lavoro correlato, autostima e risultati. Coaching 1:1 online in italiano.";
// Usa un URL assoluto HTTPS (1200x630)
const OG_IMAGE_URL = "https://www.tuo-dominio.it/og-image.jpg";
const CANONICAL_PATH = "/";

// Inietta meta tag nel <head>
function MetaTags({ title = DEFAULT_TITLE, description = DEFAULT_DESC }: { title?: string; description?: string }) {
  useEffect(() => {
    const d = document;
    try { d.documentElement.setAttribute("lang", "it"); } catch {}
    const upsert = (attr: "name"|"property", key: string, value: string) => {
      if (!value) return;
      let el = d.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = d.createElement("meta"); el.setAttribute(attr, key); d.head.appendChild(el); }
      el.setAttribute("content", value);
    };
    d.title = title;
    const origin = window.location?.origin ?? "https://www.tuo-dominio.it";
    const canonicalHref = origin + CANONICAL_PATH;
    let linkCanonical = d.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) { linkCanonical = d.createElement("link"); linkCanonical.rel = "canonical"; d.head.appendChild(linkCanonical); }
    linkCanonical.href = canonicalHref;

    upsert("name","robots","index,follow");
    upsert("name","description",description);
    upsert("property","og:type","website");
    upsert("property","og:locale","it_IT");
    upsert("property","og:site_name",SITE_NAME);
    upsert("property","og:title",title);
    upsert("property","og:description",description);
    upsert("property","og:url",canonicalHref);
    if (/^https?:\/\//.test(OG_IMAGE_URL)) upsert("property","og:image",OG_IMAGE_URL);

    upsert("name","twitter:card","summary_large_image");
    upsert("name","twitter:title",title);
    upsert("name","twitter:description",description);
    if (/^https?:\/\//.test(OG_IMAGE_URL)) upsert("name","twitter:image",OG_IMAGE_URL);
  }, [title, description]);
  return null;
}

// JSON-LD (WebSite, ProfessionalService, Service, FAQ + opzionale Video)
function SEOJsonLd() {
  const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://www.tuo-dominio.it";
  const canonical = origin + CANONICAL_PATH;
  const website = {"@context":"https://schema.org","@type":"WebSite",url:canonical,name:`${SITE_NAME} — Coaching 1:1`,inLanguage:"it-IT"};
  const org = {"@context":"https://schema.org","@type":"ProfessionalService",name:`${SITE_NAME} — Coaching 1:1`,url:canonical,email:"marcomariani.coach@gmail.com",telephone:"+39 349 466 4612",areaServed:"IT",address:{"@type":"PostalAddress",streetAddress:"Vicolo Ticino 9",addressLocality:"Legnano",postalCode:"20025",addressRegion:"MI",addressCountry:"IT"}};
  const service = {"@context":"https://schema.org","@type":"Service",name:"Coaching 1:1 online in italiano",provider:{"@type":"ProfessionalService",name:SITE_NAME},areaServed:"IT",availableChannel:{"@type":"ServiceChannel",serviceUrl: CALENDLY_SESSION}};
  const faq = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question",name:"Scetticismo: il coaching fa per me?",acceptedAnswer:{"@type":"Answer",text:"Con Ossigeno 45’ valutiamo insieme, senza impegno, se posso esserti di aiuto. Se non è il momento, risorse o referral."}},
    {"@type":"Question",name:"Tempo: non ne ho.",acceptedAnswer:{"@type":"Answer",text:"Percorso essenziale: online, ritmo e durata su misura, ≥ 4 sessioni consigliate, chat tra sessioni (entro 12h)."}},
    {"@type":"Question",name:"Costo: come funziona?",acceptedAnswer:{"@type":"Answer",text:"Prezzo personalizzato. Dopo la call ricevi proposta scritta chiara. Nessuna sorpresa."}},
    {"@type":"Question",name:"È terapia?",acceptedAnswer:{"@type":"Answer",text:"No. È coaching. Se emergono elementi clinici, referral a professionisti più idonei."}}
  ]};
  const videoIsAbsolute = /^https?:\/\//.test(VIDEO_SRC);
  const videoObject = videoIsAbsolute ? {"@context":"https://schema.org","@type":"VideoObject",name:"Secondo Respiro – Introduzione",description:"Video di presentazione del percorso di coaching Secondo Respiro.",thumbnailUrl: /^https?:\/\//.test(OG_IMAGE_URL) ? [OG_IMAGE_URL] : undefined,uploadDate: new Date().toISOString().split("T")[0],contentUrl: VIDEO_SRC,embedUrl: canonical} : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(website)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(org)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(service)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faq)}} />
      {videoObject ? <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(videoObject)}} /> : null}
    </>
  );
}

function getHeaderOffset(): number { const el = document.getElementById('site-header'); return el ? el.offsetHeight : 0; }
function SmoothHashScroll() {
  useEffect(() => {
    const canUseHistory = (() => {
      try {
        const href = window.location.href || "";
        if (href.startsWith("about:")) return false;
        if (window.top !== window.self) return false;
        return !!(window.history && typeof window.history.replaceState === "function");
      } catch { return false; }
    })();
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const a = t?.closest && (t.closest('a[href^="#"]') as HTMLAnchorElement | null);
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href || href === "#" || href.length < 2) return;
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
      if (canUseHistory) { try { window.history.replaceState(window.history.state, "", href); } catch {} }
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

// Active section via scroll (leggero)
function useActiveSectionScroll(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      let cur: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - getHeaderOffset() <= 1) cur = id;
      }
      setActive(cur || ids[0] || null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [ids.join(",")]);
  return active;
}

// ==========================
// Dev "test" console checks
// ==========================
function DevDiagnostics() {
  useEffect(() => {
    const results: { name: string; pass: boolean; note?: string }[] = [];
    const ids = ["#per-chi", "#come-funziona", "#obiezioni", "#testimonianze", "#coachee", "#cta", "#video"];
    const allExist = ids.every((sel) => !!document.querySelector(sel));
    results.push({ name: "anchors-exist", pass: allExist, note: allExist ? "ok" : `missing: ${ids.filter(s => !document.querySelector(s)).join(", ")}` });

    // Nuovo comportamento: NESSUN widget popup → nessun attributo data-calendly-popup
    const anyPopupAttr = !!document.querySelector('[data-calendly-popup]');
    results.push({ name: "no-popup-attrs", pass: !anyPopupAttr });

    // Devono esserci più link a calendly.com per Prenota sessione
    const sessionLinks = Array.from(document.querySelectorAll('a[href^="https://calendly.com/marcomarianicoach"]')) as HTMLAnchorElement[];
    results.push({ name: "session-links>=3", pass: sessionLinks.length >= 3, note: String(sessionLinks.length) });

    // Link presente nell'area coachee
    const coacheeLink = document.querySelector('#coachee a[href^="https://calendly.com/marcomarianicoach"]');
    results.push({ name: "coachee-has-link", pass: !!coacheeLink });

    // Video: esistenza e tipo sorgente
    const v = document.querySelector('video#video') as HTMLVideoElement | null;
    results.push({ name: "video-element-exists", pass: !!v });
    const vSrc = v?.querySelector('source')?.getAttribute('src') || '';
    const isValidSrc = /^https?:\/\//.test(vSrc) || vSrc.startsWith('/');
    results.push({ name: "video-src-valid", pass: !!v && isValidSrc, note: isValidSrc ? 'ok' : 'invalid-src' });

    // Stripe badge presente
    const stripeBadge = document.querySelector('[data-test="stripe-badge"]');
    results.push({ name: "stripe-badge-exists", pass: !!stripeBadge });

    // Ulteriore test: il video deve essere cliccabile (pointer-events != none)
    try {
      const v2 = document.querySelector('video#video') as HTMLVideoElement | null;
      const pe = v2 ? getComputedStyle(v2).pointerEvents : 'none';
      results.push({ name: 'video-pointer-events', pass: pe !== 'none', note: pe });
    } catch {}

    results.push({ name: "one-testimonianze-section", pass: document.querySelectorAll('section#testimonianze').length === 1, note: String(document.querySelectorAll('section#testimonianze').length) });
    // eslint-disable-next-line no-console
    console.table(results);
  }, []);
  return null;
}

// ==========================
// UI
// ==========================
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => {
      try { setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768); } catch { setIsMobile(true); }
    };
    update();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
  }, []);
  return isMobile;
}
export default function SecondoRespiroLanding() {
  const active = useActiveSectionScroll(["per-chi","come-funziona","obiezioni","testimonianze","coachee","cta"]);

  return (
    <div id="top" className="min-h-screen bg-white text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: ".font-sans{font-family:'Manrope',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans',sans-serif;} .clamped{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}" }} />
      <SmoothHashScroll />
      <DevDiagnostics />
      {/* SEO: meta tag + JSON-LD */}
      <MetaTags />
      <SEOJsonLd />
      <Header active={active} />
      <Hero />
      <ProofBar />
      <FitSection />
      <HowItWorks />
      <Objections />
      <Testimonials />
      <Coachee />
      <CTA />
      <Footer />
    </div>
  );
}

function Header({ active }: { active: string | null }) {
  const [open, setOpen] = useState(false);
  const links = [
    { id: "per-chi", label: "Per chi" },
    { id: "come-funziona", label: "Come funziona" },
    { id: "obiezioni", label: "Domande" },
    { id: "testimonianze", label: "Testimonianze" },
    { id: "coachee", label: "Area coachee" },
  ] as const;
  return (
    <header id="site-header" className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#top" className="font-sans font-semibold tracking-tight text-xl"><span className="text-blue-700">SECONDO RESPIRO</span></a>
        <nav className="hidden md:flex gap-8 text-sm" aria-label="Navigazione principale">
          {links.map(({id, label}) => (
            <a key={id} href={`#${id}`} className={`flex items-center gap-2 hover:text-blue-700 ${active === id ? 'text-blue-700' : ''}`} aria-current={active === id ? 'page' : undefined}>
              <span className={`h-1.5 w-1.5 rounded-full bg-blue-700 transition-opacity ${active === id ? 'opacity-100' : 'opacity-0'}`} aria-hidden />
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3 ml-6">
          <a href={CALENDLY_OSSIGENO} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-md ring-1 ring-slate-300 hover:ring-blue-700">Prenota Ossigeno 45'</a>
          <a href={CALENDLY_SESSION} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-md ring-1 ring-slate-300 hover:ring-blue-700">Prenota sessione</a>
        </div>
        <button className="md:hidden inline-flex items-center justify-center rounded-md p-2 ring-1 ring-slate-300" aria-label={open ? 'Chiudi menu' : 'Apri menu'} aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map(({id, label}) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="py-1">{label}</a>
            ))}
            <a href={CALENDLY_OSSIGENO} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md ring-1 ring-slate-300">Prenota Ossigeno 45'</a>
            <a href={CALENDLY_SESSION} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md ring-1 ring-slate-300">Prenota sessione</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className="bg-[#0057FF] text-white">
      <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <div className="text-xs tracking-widest uppercase text-white/90">Coaching 1:1 · Online</div>
          <h1 className="mt-3 font-sans text-5xl md:text-6xl leading-[1.03]">Secondo Respiro</h1>
          <p className="mt-4 text-blue-100/90 max-w-2xl text-lg">Ho trasformato un'esperienza personale di forte burnout in un modo semplice e concreto di lavorare su stress da lavoro correlato, autostima e crisi di risultati con obiettivi definiti e strategie chiare. Senza fronzoli, solo con ascolto attivo, feedback costruttivi e domande potenti. NO TERAPIA, SOLO COACHING.</p>
          <p className="mt-3 text-blue-100/80 max-w-2xl">Ciao, sono Marco: Sales Manager da quasi vent'anni, e coach accreditato ICF. Con la call gratuita “Ossigeno 45'” capiamo se posso esserti utile.</p>
          <div className="mt-7 flex gap-3 flex-wrap">
            <a href={CALENDLY_OSSIGENO} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-md bg-white text-[#0B1220] ring-1 ring-white/30">Prenota Ossigeno 45'</a>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative p-0 pointer-events-auto">
            {(() => { const isLocal = !/^https?:\/\//.test(VIDEO_SRC) && !VIDEO_SRC.startsWith('/'); return (
              <>
                <video id="video" className="block w-full rounded-md ring-1 ring-white/20 bg-black/20 pointer-events-auto" controls preload="metadata" playsInline poster={VIDEO_POSTER}>
                  <source src={VIDEO_SRC} type="video/mp4" />
                  <source src={VIDEO_SRC_WEBM} type="video/webm" />
                  Il tuo browser non supporta il tag video.
                </video>
                {isLocal && (
                  <div className="mt-2 text-xs text-blue-100/80">
                    Nota: il video è referenziato da un percorso <em>locale</em>. Carica il file online e sostituisci <code>VIDEO_SRC</code> con un URL https.
                  </div>
                )}
              </>
            ); })()}
            
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofBar() {
  const items = ["Coach accreditato ICF","Sales Manager da ~20 anni","Online · Italiano","Risposta chat entro 12h"];
  return (
    <section className="py-6 border-t border-b border-blue-200 bg-blue-50/60">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-2">
        {items.map((t) => (<span key={t} className="px-3 py-1.5 rounded-full bg-white ring-1 ring-blue-200">{t}</span>))}
      </div>
    </section>
  );
}

function SectionTitle({ title }: { title: string }) { return <h2 className="font-sans text-3xl md:text-4xl leading-tight text-slate-900">{title}</h2>; }

function FitSection() {
  return (
    <section id="per-chi" className="border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold">È per te se</h3>
          <ul className="mt-3 space-y-2">
            <li>• vuoi rimettere ordine a priorità e confini;</li>
            <li>• cerchi un confronto schietto per far crescere la fiducia;</li>
            <li>• preferisci un lavoro pratico e misurabile, senza fronzoli.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Non è per te se</h3>
          <ul className="mt-3 space-y-2">
            <li>• cerchi terapia o supporto clinico (in quel caso faccio referral);</li>
            <li>• vuoi “ricette magiche” o promesse di risultati;</li>
            <li>• non hai disponibilità a metterti in gioco tra una sessione e l’altra.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const cards: { title: string; items: string[] }[] = [
    { title: "1) Prenota ‘Ossigeno 45’", items: ["Call gratuita di 45 minuti su Zoom.", "Fit su contesto, aspettative, priorità.", "Burnout Map (PDF) alla conferma.", "Promemoria a 48h/24h.", "Slot su Calendly."] },
    { title: "2) Se c'è match → percorso 1:1", items: ["Online, ritmo/durata decisi insieme.", "Suggerito: ≥ 4 sessioni.", "Ascolto, domande, feedback costruttivo.", "Chat tra sessioni (entro 12h).", "Prezzo concordato e scritto."] },
    { title: "3) Una sessione tipo", items: ["Apertura (3’): obiettivo e accordi.", "Esplorazione su ciò che conta.", "Chiarezza: riformulazione + feedback.", "Chiusura (5’): takeaway e prossimo step.", "Se emergono profili clinici → referral."] },
  ];
  return (
    <section id="come-funziona" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SectionTitle title="Come funziona" />
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div key={card.title} className="p-6 rounded-md bg-white ring-1 ring-slate-200">
              <div className="text-xs text-slate-500">Step {i + 1}</div>
              <h3 className="mt-1 font-bold text-lg">{card.title}</h3>
              <ul className="mt-3 text-sm space-y-2">
                {card.items.map((it) => (<li key={it}>• {it}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Objections() {
  const faqs = [
    { q: "Scetticismo: il coaching fa per me?", a: "Con Ossigeno 45’ valutiamo insieme, senza impegno, se posso esserti di aiuto. Se non è il momento, risorse o referral." },
    { q: "Tempo: non ne ho.", a: "Percorso essenziale: online, ritmo e durata su misura, ≥ 4 sessioni consigliate, chat tra sessioni (entro 12h)." },
    { q: "Costo: come funziona?", a: "Prezzo personalizzato. Dopo la call ricevi proposta scritta chiara. Nessuna sorpresa." },
    { q: "È terapia?", a: "No. È coaching. Se emergono elementi clinici, referral a professionisti più idonei." },
  ];
  return (
    <section id="obiezioni" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SectionTitle title="Domande" />
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4 border-b border-slate-200">
              <summary className="font-semibold cursor-pointer flex items-center justify-between">
                <span>{f.q}</span>
                <ChevronDown className="h-4 w-4 text-blue-700 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6 text-xs text-slate-600">Reminder via email e, se acconsenti, WhatsApp. 18+. Nessuna registrazione senza consenso. Privacy & Cookie nel footer.</div>
      </div>
    </section>
  );
}

function Testimonials() {
  // Dati testimonianze
  const items: { paras: string[]; author: string }[] = [
    {
      paras: [
        "Cercavo proprio Ossigeno... ed è quello che è arrivato! Volevo ritrovare fiducia nella mia persona e nella mia visione dal punto di vista del lavoro! È stato intenso ma un percorso vissuto e vero che ha lasciato un ottimo segno!",
      ],
      author: "— G, 37 anni, professionista sanitario",
    },
    {
      paras: [
        "“Io ti ho solo aiutato a vedere cose che, in te, per me erano lampanti. Hai fatto tutto tu.”",
        "Una frase che non dimenticherò, nata da un confronto autentico nel mio percorso di coaching con Marco iniziato a Maggio 2025.",
        "Non è facile parlare apertamente, ma quando trovi qualcuno che ti ascolta senza giudicare o imporre… il mondo cambia con gentilezza.",
        "Un grazie sincero al mio coach Marco per non avermi mai detto ‘cosa fare’, ma per avermi aiutato a rivedere me stesso con occhi nuovi, riempiendo con le giuste cose il mio zainetto!",
      ],
      author: "— F, 43 anni, real estate manager",
    },
  ];

  const isMobile = useIsMobile();

  // Slider mobile
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const deltaX = useRef(0);
  const go = (dir: number) => setIdx(v => (v + dir + items.length) % items.length);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove  = (e: React.TouchEvent) => { if (touchStartX.current != null) deltaX.current = e.touches[0].clientX - touchStartX.current; };
  const onTouchEnd   = () => { if (Math.abs(deltaX.current) > 50) go(deltaX.current < 0 ? 1 : -1); touchStartX.current = null; deltaX.current = 0; };

  const WORDS_PER_LINE = 6;   // <= 6 parole per riga (mobile)
  const PREVIEW_WORDS  = 18;  // mostra più dopo 18 parole

  const TestimonialBlock = ({ t, clamp = true }: { t: { paras: string[]; author: string }, clamp?: boolean }) => {
    const [expanded, setExpanded] = useState(!clamp);

    // Testo completo → parole
    const fullText = t.paras.join(" ").replace(/\s+/g, " ").trim();
    const words = fullText.split(/\s+/);

    // utility: parole → righe di n parole
    const toLines = (ws: string[], perLine: number) => {
      const lines: string[] = [];
      for (let i = 0; i < ws.length; i += perLine) {
        lines.push(ws.slice(i, i + perLine).join(" "));
      }
      return lines;
    };

    if (isMobile) {
      const visibleWords = expanded ? words : words.slice(0, PREVIEW_WORDS);
      const lines = toLines(visibleWords, WORDS_PER_LINE);

      return (
        <div>
          <blockquote className="font-sans text-[clamp(15px,3.6vw,17px)] leading-[1.65] break-words hyphens-auto text-slate-900">
            {lines.map((ln, i) => (
              <p key={i} className={i === 0 ? "italic" : ""}>{ln}</p>
            ))}
            <footer className="mt-4 text-[0.925rem] not-italic font-sans text-slate-600">{t.author}</footer>
          </blockquote>

          {words.length > PREVIEW_WORDS && clamp && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(v => !v)}
                className="text-sm font-medium text-blue-700 underline underline-offset-2"
              >
                {expanded ? "Mostra meno" : "Mostra più"}
              </button>
            </div>
          )}
        </div>
      );
    }

    // Desktop: paragrafi normali
    const [first, ...rest] = t.paras;
    return (
      <div>
        <blockquote className="font-sans md:text-xl leading-[1.65] break-words hyphens-auto text-slate-900">
          <p><em>{first || ""}</em></p>
          {rest.map((p, i) => (<p key={i} className="not-italic">{p}</p>))}
          <footer className="mt-4 text-[0.925rem] not-italic font-sans text-slate-600">{t.author}</footer>
        </blockquote>
      </div>
    );
  };

  return (
    <section id="testimonianze" className="bg-white border-t border-slate-200" aria-labelledby="testimonianze-title">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 id="testimonianze-title" className="font-sans text-4xl md:text-5xl leading-tight text-slate-900">Testimonianze</h2>

        {/* Mobile slider */}
        <div className="md:hidden mt-8">
          <div className="relative overflow-x-hidden rounded-md ring-1 ring-slate-200 bg-white">
            <ul
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${idx * 100}%)`, width: `${items.length * 100}%` }}
            >
              {items.map((t, i) => (
                <li
                  key={i}
                  className="w-full shrink-0 px-3 py-4"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >                  <TestimonialBlock t={t} clamp />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4">
            <button aria-label="Testimonianza precedente" onClick={() => go(-1)} className="rounded-full p-2 ring-1 ring-slate-300 bg-white">
              <ArrowRight className="h-4 w-4 -scale-x-100" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Vai alla testimonianza ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className={`${idx === i ? "bg-blue-700" : "bg-slate-300"} h-2.5 w-2.5 rounded-full`}
                />
              ))}
            </div>
            <button aria-label="Testimonianza successiva" onClick={() => go(1)} className="rounded-full p-2 ring-1 ring-slate-300 bg-white">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid mt-10 grid-cols-2 gap-10">
          {items.map((t, i) => (<TestimonialBlock key={i} t={t} clamp={false} />))}
        </div>
      </div>
    </section>
  );
}



function StripeBadge() {
  // Badge Stripe minimale (senza asset esterni) per evitare richieste di rete
  return (
    <span data-test="stripe-badge" className="inline-flex items-center gap-1.5" aria-label="Stripe logo">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-[#635BFF]" aria-hidden>
        <span className="text-white text-[10px] font-black leading-none">S</span>
      </span>
      <span className="text-[#635BFF] font-medium leading-none">Stripe</span>
    </span>
  );
}

function Coachee() {
  return (
    <section id="coachee" className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SectionTitle title="Sei già coachee? Prenota la tua sessione" />
        <p className="mt-2 text-slate-700 max-w-2xl text-sm">Se hai già iniziato il percorso, puoi prenotare in autonomia la prossima sessione.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a href={CALENDLY_SESSION} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-md bg-[#0057FF] text-white hover:bg-[#1A6BFF]">Prenota sessione <span className="inline-block ml-1 align-middle"><ArrowRight className="h-4 w-4" /></span></a>
          <div className="flex items-center gap-2 text-xs text-slate-600"><StripeBadge /><span>Pagamento sicuro tramite Stripe — Fattura entro 24 ore successive alla call</span></div>
        </div>
        <div className="mt-3 text-xs text-slate-500">Serve aiuto? Scrivi a <a className="underline" href="mailto:marcomariani.coach@gmail.com">marcomariani.coach@gmail.com</a> o WhatsApp: <a className="underline" href="tel:+393494664612">+39 349 466 4612</a>.</div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-[#0057FF] text-white">
      <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-sans text-3xl md:text-4xl leading-tight">Ossigeno 45’ — Call gratuita di valutazione</h2>
        <p className="mt-2 text-blue-100">Valutiamo insieme, con la prima call gratuita, se posso esserti di aiuto. Slot e prenotazioni su Calendly.</p>
        <div className="mt-6"><a href={CALENDLY_OSSIGENO} target="_blank" rel="noreferrer" className="inline-flex px-7 py-3 rounded-md bg-white text-[#0B1220] ring-1 ring-white/30">Prenota Ossigeno 45'</a></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-extrabold tracking-tight"><span className="text-blue-700">SECONDO RESPIRO</span></div>
          <p className="mt-2">Chiarezza, focus, azione. Coaching 1:1 online in italiano.</p>
        </div>
        <div>
          <div className="font-semibold">Contatti</div>
          <ul className="mt-2 space-y-1">
            <li>Email: <a className="underline" href="mailto:marcomariani.coach@gmail.com">marcomariani.coach@gmail.com</a></li>
            <li>Telefono / WhatsApp: <a className="underline" href="tel:+393494664612">+39 349 466 4612</a></li>
            <li>Indirizzo: Vicolo Ticino 9, 20025 Legnano (MI)</li>
            <li>Slot e prenotazioni: <a className="underline" href={CALENDLY_OSSIGENO} target="_blank" rel="noreferrer">Calendly</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Risorse</div>
          <ul className="mt-2 space-y-1">
            <li><a className="underline" href="#cta">Prenota Ossigeno 45'</a></li>
            <li><a className="underline" href={CALENDLY_SESSION} target="_blank" rel="noreferrer">Prenota sessione</a></li>
            <li><a className="underline" href="#per-chi">Per chi</a></li>
            <li><a className="underline" href="#come-funziona">Come funziona</a></li>
            <li><a className="underline" href="#obiezioni">Domande</a></li>
            <li><a className="underline" href="#testimonianze">Testimonianze</a></li>
            <li><a className="underline" href="#coachee">Area coachee</a></li>
            <li><a className="underline" href="#hero">Video (120s)</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© 2025 Marco Mariani — SECONDO RESPIRO. 18+. Nessuna registrazione delle call senza consenso. Coaching, non terapia.</p>
          <a href="#" className="underline">Impostazioni Cookie</a>
        </div>
      </div>
    </footer>
  );
}

// Keep this small proof bar at the very top for visual continuity
function TopBar() { return <div className="h-1.5 w-full bg-blue-700" aria-hidden />; }
