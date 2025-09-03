import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

// ==========================
// Calendly (single source of truth)
// ==========================
const CALENDLY_OSSIGENO = "https://calendly.com/marcomarianicoach/ossigeno-45-gratuito"; // call gratuita
const CALENDLY_SESSION = "https://calendly.com/marcomarianicoach"; // pagina con scelta tipologie
// Video sorgente (se locale, verrà mostrato un avviso)
const VIDEO_SRC = "/Videolanding.Mp4"; // // 
// Poster inline (nessuna rete); sostituisci con un URL https se vuoi un frame reale
const VIDEO_POSTER = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#0057FF" offset="0"/><stop stop-color="#7AA2FF" offset="1"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-size="56" fill="#fff" opacity="0.9">Secondo Respiro · Video</text></svg>')}`;

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

    // eslint-disable-next-line no-console
    console.table(results);
  }, []);
  return null;
}

// ==========================
// UI
// ==========================
export default function SecondoRespiroLanding() {
  const active = useActiveSectionScroll(["per-chi","come-funziona","obiezioni","testimonianze","coachee","cta"]);

  return (
    <div id="top" className="min-h-screen bg-white text-slate-900">
      <style dangerouslySetInnerHTML={{ __html: ".font-sans{font-family:'Manrope',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans',sans-serif;}" }} />
      <SmoothHashScroll />
      <DevDiagnostics />
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
      <FloatingCTA />
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
          <div className="relative rounded-md bg-white/10 ring-1 ring-white/20 p-6 pointer-events-auto">
            {(() => { const isLocal = !/^https?:\/\//.test(VIDEO_SRC) && !VIDEO_SRC.startsWith('/'); return (
              <>
                <video id="video" className="w-full h-40 md:h-56 rounded bg-black/20 z-10 pointer-events-auto" controls preload="metadata" playsInline poster={VIDEO_POSTER}>
                  <source src={VIDEO_SRC} type="video/mp4" />
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
  return (
    <section id="testimonianze" className="bg-white border-t border-slate-200" aria-labelledby="testimonianze-title">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 id="testimonianze-title" className="font-sans text-4xl md:text-5xl leading-tight text-slate-900">Testimonianze</h2>
        {/* Layout responsive: su mobile scorrono orizzontalmente, su desktop 2 colonne */}
        <div className="mt-10 flex gap-10 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-10 md:overflow-visible">
          {/* G */}
          <blockquote className="font-sans italic text-2xl leading-snug text-slate-900 shrink-0 snap-center min-w-[90%] md:min-w-0">
            “Cercavo proprio Ossigeno... ed è quello che è arrivato! Volevo ritrovare fiducia nella mia persona e nella mia visione dal punto di vista del lavoro! È stato intenso ma un percorso vissuto e vero che ha lasciato un ottimo segno!”
            <footer className="mt-4 text-sm not-italic font-sans text-slate-600">— G, 37 anni, professionista sanitario</footer>
          </blockquote>
          {/* F */}
          <blockquote className="font-sans italic text-2xl leading-snug text-slate-900 shrink-0 snap-center min-w-[90%] md:min-w-0">
            <p>“𝐼𝑜 𝑡𝑖 ℎ𝑜 𝑠𝑜𝑙𝑜 𝑎𝑖𝑢𝑡𝑎𝑡𝑜 𝑎 𝑣𝑒𝑑𝑒𝑟𝑒 𝑐𝑜𝑠𝑒 𝑐ℎ𝑒, 𝑖𝑛 𝑡𝑒, 𝑝𝑒𝑟 𝑚𝑒 𝑒𝑟𝑎𝑛𝑜 𝑙𝑎𝑚𝑝𝑎𝑛𝑡𝑖. 𝐻𝑎𝑖 𝑓𝑎𝑡𝑡𝑜 𝑡𝑢𝑡𝑡𝑜 𝑡𝑢.”</p>
            <p className="mt-4 not-italic text-[1.15rem] text-slate-800">Una frase che non dimenticherò, nata da un confronto autentico nel mio percorso di coaching con Marco iniziato a Maggio 2025.</p>
            <p className="mt-2 not-italic text-[1.15rem] text-slate-800">Non è facile parlare apertamente, ma quando trovi qualcuno che ti ascolta senza giudicare o imporre… il mondo cambia con gentilezza.</p>
            <p className="mt-2 not-italic text-[1.15rem] text-slate-800">Un grazie sincero al mio coach Marco per non avermi mai detto “cosa fare”, ma per avermi aiutato a rivedere me stesso con occhi nuovi, riempiendo con le giuste cose il mio zainetto!</p>
            <footer className="mt-4 text-sm not-italic font-sans text-slate-600">— F, 43 anni, real estate manager</footer>
          </blockquote>
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

function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`hidden md:block fixed right-6 z-40 transition ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
      <a href={CALENDLY_SESSION} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-md bg-white ring-1 ring-slate-200 text-[#0057FF] shadow-[0_8px_24px_rgba(0,87,255,.25)] hover:shadow-[0_12px_36px_rgba(0,87,255,.35)]">
        Prenota sessione <span className="inline-block ml-1 align-middle"><ArrowRight className="h-4 w-4" /></span>
      </a>
    </div>
  );
}

// Keep this small proof bar at the very top for visual continuity
function TopBar() { return <div className="h-1.5 w-full bg-blue-700" aria-hidden />; }
