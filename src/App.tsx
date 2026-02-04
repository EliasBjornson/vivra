import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

    // Intresseanmälan-form
  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    email: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);


    // Byt dessa två länkar när du har dina slutliga https-URL:er
  const infoImgMen55 = "https://EXEMPEL-LANK-1";
  const infoImgWomen65 = "https://EXEMPEL-LANK-2";

  const navLinks = [
    { href: "#hur", label: "Så funkar det" },
    { href: "#paket", label: "Paket" },
    { href: "#exempel", label: "Exempel" },
    { href: "#faq", label: "FAQ" },
    { href: "#filosofi", label: "Vår filosofi" },
    { href: "#kontakt", label: "Kontakt" },
  ];

      const scrollToSection = useCallback((hash: string) => {
    if (typeof document === "undefined") return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    // Dynamisk höjd på sticky header (viktigt på mobil när menyn öppnas/stängs)
    const header = document.querySelector("header");
    const headerOffset = header ? header.getBoundingClientRect().height : 0;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - headerOffset;

    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-950 to-slate-950 text-slate-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 rounded-2xl grid place-items-center shadow-md overflow-hidden">
              <img
                src="https://i.ibb.co/QFhxFjrm/Chat-GPT-Image-5-jan-2026-09-39-08.png"
                alt="Vivra logotyp"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-semibold tracking-tight text-lg sm:text-xl">Vivra</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA + Mobile menu button */}
          <div className="flex items-center gap-2">
            <a
              href="#boka"
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 px-3 sm:px-4 py-2 text-xs sm:text-sm"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#boka");
              }}
            >
              Intresseanmälan <ChevronRight className="h-4 w-4" />
            </a>
            <button
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-xl border border-white/15 bg-slate-900/40"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Öppna meny"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/15 bg-slate-950/95">
            <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-1 text-slate-200 hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    // Vänta tills menyn stängts innan scroll (fixar mobil-offset)
                    setTimeout(() => scrollToSection(link.href), 50);
                  }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#boka"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-2 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#boka");
                  setMobileOpen(false);
                }}
              >
                Intresseanmälan <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Pre-launch banner */}
      <section className="bg-gradient-to-r from-orange-400/15 via-red-500/10 to-slate-900/0 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-start sm:items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-orange-300/30 bg-orange-300/10 px-3 py-1 text-xs font-semibold text-orange-100">
              Pre‑launch
            </span>
            <p className="text-sm text-slate-200 leading-snug">
              Vi har ännu inte öppnat verksamheten. Vi planerar att slå upp dörrarna <strong>juni 2026</strong>.
              Vill du bli kontaktad så fort vi är igång?
            </p>
          </div>
          <a
            href="#boka"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-2 text-sm whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#boka");
            }}
          >
            Gör en intresseanmälan <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Hero */}

      <section className="relative bg-slate-900/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="relative z-20">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 6}}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight"
            >
              Vill du undvika hjärt-kärlsjukdom?<br />{" "}
              <span className="bg-gradient-to-r from-red-800 to-orange-300 bg-clip-text text-transparent">
                Välkommen till Vivra
              </span>
            </motion.h1>
            <p className="mt-5 sm:mt-6 text-sm sm:text-base text-slate-200 max-w-prose">
              Visste du att hjärt-kärlsjukdom i de flesta fall kan förebyggas?
              Åderförkalkning – grundorsaken till hjärt-kärlsjukdom – utvecklas ofta i det tysta. 
              Många människor går omkring med förändringar i hjärtats kärl utan att veta om det. 
              På Vivra erbjuder vi hjärt-skanning som kan upptäcka tidiga tecken på åderförkalkning 
              och bryta utvecklingen innan det hinner leda till hjärtinfarkt.
            </p>
            <div className="mt-7 sm:mt-8 flex flex-wrap gap-3">
              <a
                href="#boka"
                className="w-full xs:w-auto text-center rounded-2xl px-5 py-3 bg-gradient-to-r from-orange-300 to-orange-800 text-slate-950 font-semibold shadow-md text-lg"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#boka");
                }}
              >
                Intresseanmälan
              </a>
              <a
                href="#hur"
                className="w-full xs:w-auto text-center rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/15 text-lg"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#hur");
                }}
              >
                Så funkar det
              </a>
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end mt-6 md:mt-0">
            <motion.img
              src="https://i.ibb.co/rfHMYrWg/Chat-GPT-Image-30-nov-2025-13-47-50.png"
              alt="Hjärta"
              className="w-72 sm:w-80 md:w-[28rem] object-contain drop-shadow-xl"
              style={{
                maskImage: "radial-gradient(circle, black 1%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(circle, black 1%, transparent 100%)",
              }}
              animate={{ opacity: [1, 0.85, 1], scale: [1, 0.985, 1] }}
              transition={{ duration: 3.3, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
            />
          </div>
        </div>
      </section>

      {/* Så funkar det */}
      <section id="hur" className="bg-slate-900/60 border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">Så funkar det</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "1. Anmäl intresse",
                text: "Är du man 45+ eller kvinna 55+ och är intresserad av att förebygga och undvika hjärt-kärlsjukdom? Anmäl ditt intresse så kontaktar vi dig och ger dig all information du behöver för att göra ett informerat beslut om screening är rätt för dig.",
              },
              {
                title: "2. Skanna hjärtat och lämna blodprov",
                text: "Vi skannar ditt hjärta på någon av våra mottagningar i Göteborg, Stockholm eller Malmö för att se om du har åderförkalkning i hjärtat eller inte. Du får också lämna blodprov på valfri provtagningsenhet för att se hur dina blodfetter ser ut.",
              },
              {
                title: "3. Möte med läkare för provsvar - online eller på plats i Göteborg",
                text: "Om du inte har åderförkalkning är det jättebra och då kommer vi i många fall inte rekommendera behandling. Om vi ser plack kommer vi att erbjuda dig att ingå i vårt preventionsprogram. Där får du rätt förebyggande behandling enligt dina mål och behov.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm"
              >
                <h3 className="mt-1 font-medium">{s.title}</h3>
                <p className="mt-2 text-slate-200">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paket */}
      <section id="paket" className="bg-slate-900/60 border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">Paket</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                name: "Vivra Screening",
                price: "3 790 kr",
                perks: [
                  "Hjärtskanning + blodprover",
                  "Medicinsk genomgång",
                  "Personlig riskprofil & plan",
                ],
                cta: "Boka checkup",
              },
              {
                name: "Vivra Preventionsprogram",
                price: "279 kr/mån",
                perks: [
                  "Initiering av förebyggande behandling",
                  "Tät uppföljning första månaderna",
                  "Alltid årliga kontroller",
                ],
                cta: "Starta programmet",
              },
            ].map((p, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/15 bg-white/5 p-6 flex flex-col text-sm"
              >
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-2 text-3xl font-bold">{p.price}</div>
                <ul className="mt-4 space-y-2 text-slate-200 list-disc list-inside flex-1">
                  {p.perks.map((x, idx) => (
                    <li key={idx}>{x}</li>
                  ))}
                </ul>
                <a
                  href="#boka"
                  className="mt-6 inline-flex justify-center rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#boka");
                  }}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patientexempel */}
      <section id="exempel" className="bg-slate-900/60 border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">Två typiska patientexempel</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-sm">
              <div className="text-xs uppercase tracking-wide text-slate-400">Exempel 1</div>
              <h3 className="mt-1 text-lg font-semibold">Skanning ren – inga plack</h3>
              <ul className="mt-4 space-y-2 text-slate-200 list-disc list-inside">
                <li>
                  Låg risk för hjärtinfarkt på kort sikt (bra!). Inte immun för alltid.
                </li>
                <li>
                  Åter‑skanning om <strong>3–5 år</strong>. Du betalar inget – vi påminner när det är dags.
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 text-sm">
              <div className="text-xs uppercase tracking-wide text-slate-400">Exempel 2</div>
              <h3 className="mt-1 text-lg font-semibold">Plack upptäcks – åtgärdsprogram</h3>
              <ul className="mt-4 space-y-2 text-slate-200 list-disc list-inside">
                <li>Vi ser tidiga förändringar i kranskärlen (subklinisk ateroskleros).</li>
                <li>
                  Underhållsfas med förebyggande behandling. Pris: <strong>249 kr/månad</strong>.
                </li>
                <li>Tät uppföljning första månaderna och årliga nya kontroller.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Info – prevalens */}
      <section className="bg-slate-900/60 border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-6 md:grid-cols-12 items-start">
            {/* Hjärt‑kärlsjukdomsskola */}
            <div className="md:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-7">
                <div className="text-xs uppercase tracking-wider text-slate-400">Hjärt‑kärlsjukdomsskola</div>
                <h2 className="mt-2 text-xl sm:text-2xl font-semibold leading-tight">
                  Hur uppstår åderförkalkning – och vad kan man göra åt den?
                </h2>
                <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed">
                  Hjärt-kärlsjukdom är den enskilt vanligaste dödsorsaken i Sverige och världen idag. 
                  Hjärtinfarkter orsakas av <strong>åderförkalkning</strong> (plack) i kranskärlen.
                  Processen börjar tidigt och drivs framförallt av <strong>blodfetter</strong> (särskilt LDL/apoB),
                  men också av högt blodtryck, högt blodsocker, övervikt och rökning. Åderförkalkning utvecklas i regel i det tysta och ger 
                  ofta inga symtom förrän ett plack brister och en hjärtinfarkt sker.
                </p>
                <div className="mt-5 grid gap-3">
                  {[ 
                    {
                      title: "Blodfetter (LDL/apoB)",
                      text: "Ju längre tid och ju högre nivå, desto större risk. Sänkning kan bromsa eller t.o.m. stoppa utvecklingen.",
                    },
                    {
                      title: "Hjärt‑skanning",
                      text: "Med hjärt-CT/DT kan vi se tidiga tecken på plack och förebygga innan hjärtinfarkten sker.",
                    },
                    {
                      title: "Förebyggande behandling",
                      text: "Läkemedel som sänker blodfetter och blodtryck används för att dessa kan bromsa eller stoppa plack-utvecklingen.",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                      <div className="font-medium text-slate-100">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-200">{item.text}</div>
                    </div>
                  ))}
                </div>

               
              </div>
            </div>

            {/* Bilder */}
            <div className="md:col-span-7">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                  Visste du att <span className="text-orange-200">hälften</span> av 55‑åriga män och 65‑åriga kvinnor i Sverige har åderförkalkning?
                </h3>
                <p className="text-slate-200 text-sm sm:text-base max-w-prose">
                  Män börjar i genomsnitt utveckla åderförkalkning ungefär tio år tidigare än kvinnor, men sjukdomen är vanlig hos båda könen. 
                  För de flesta människor i Sverige idag är det därför inte en fråga om man får åderförkalkning, utan när. Det avgörande är 
                  hur tidigt och hur snabbt processen utvecklas. Med dagens kunskap och förebyggande behandling kan vi 
                  förhindra en stor del av all hjärt-kärlsjukdom.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-2">
                {[ 
                  {
                    title: "55‑åriga män",
                    src: "https://i.ibb.co/0ykk4sxS/Chat-GPT-Image-5-jan-2026-20-59-10.png",
                    alt: "Hälften av alla 55‑åriga män i Sverige har åderförkalkning i hjärtat",
                  },
                  {
                    title: "65‑åriga kvinnor",
                    src: "https://i.ibb.co/bgydb136/Chat-GPT-Image-5-jan-2026-20-59-04.png",
                    alt: "Hälften av alla 65‑åriga kvinnor i Sverige har åderförkalkning i hjärtat",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-4 sm:p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs uppercase tracking-wider text-slate-400">{card.title}</div>
                      <div className="text-sm font-semibold text-slate-100">    </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                      <div className="relative w-full max-w-[220px] sm:max-w-[320px]">
                        <div className="absolute -inset-2 rounded-[26px] bg-gradient-to-r from-orange-400/15 via-red-400/10 to-sky-400/10 blur-2xl" />
                        <img
                          src={card.src}
                          alt={card.alt}
                          className="relative w-full h-auto rounded-[22px] shadow-2xl object-cover"
                          style={{
                            maskImage: "radial-gradient(closest-side, black 60%, transparent 100%)",
                            WebkitMaskImage: "radial-gradient(closest-side, black 60%, transparent 100%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-900/60 border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">Vanliga frågor</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm text-slate-200">
            <div>
              <h4 className="font-medium text-slate-100">Varför skannar ni inte män under 45 år och kvinnor under 55 år?</h4>
              <p className="mt-2">I lägre åldrar än dessa är sannolikheten att finna åderförkalkning så låg att en hjärt-skanning inte är att rekommendera. </p>
            </div>
             <div>
              <h4 className="font-medium text-slate-100">Vilka blodprover mäter ni?</h4>
              <p className="mt-2">Vi fokuserar på att mäta blodfetter eftersom det är det som är grundorsaken bakom hjärt-kärlsjukdom. 
              Vi mäter inte bara LDL-kolesterol men också apoB, triglycerider och lipoprotein(a). Sedan väger vi samman denna information för att få en samlad bild av din blodfettsprofil.</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-100">Hur hög är stråldosen?</h4>
              <p className="mt-2">Vi använder modern lågdos-hjärt-CT som minimerar strålningen.</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-100">Behöver alla medicin?</h4>
              <p className="mt-2">
                Nej. Om inga plack hittas och blodprover är bra räcker god livsstil och åter-skanning efter 3–5 år.</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-100">Vad ingår i 249 kr/mån?</h4>
              <p className="mt-2">
                Uppföljning, recept, och samordning av förebyggande vård. Vi föreslår, du medbestämmer.</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-100">Kan företag ansluta?</h4>
              <p className="mt-2">Ja, vi erbjuder företagsavtal och lösningar på gruppnivå.</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-100">Ger inte statiner mycket biverkningar?</h4>
              <p className="mt-2">Statiner kan i vissa fall ge biverkningar men är i regel mycket säkra läkemedel. 
                Idag har vi dessutom andra sätt att sänka LDL-kolesterol på, som tex ezetimib, bempedinsyra och PCSK9 inhibitorer.</p>
            </div>
             <div>
              <h4 className="font-medium text-slate-100">Hur mycket kan jag sänka min risk för hjärt-kärlsjukdom</h4>
              <p className="mt-2">Det beror på men en halvering av risk är vanligtvis uppnåbar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intresseanmälan */}
<section id="boka" className="bg-slate-900/60 border-t border-white/15">
  <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
    <div className="grid gap-8 md:grid-cols-2 items-start">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold">Intresseanmälan</h2>
        <p className="mt-3 text-slate-200 text-sm sm:text-base max-w-prose">
          Fyll i namn, kön, ålder och kontaktuppgifter så återkommer vi med mer information och nästa steg.
        </p>

        <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-6 text-sm text-slate-200">
          <div className="font-medium text-slate-100">Vad händer sen?</div>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Vi kontaktar dig inom kort.</li>
            <li>Vi går igenom upplägg och om du passar för en skanning.</li>
            <li>Om du vill går vi vidare med bokning av hjärt-skanning och blodprov.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/5 p-6">
        {!submitted ? (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setFormError("");

              const nameOk = form.name.trim().length >= 2;

              const ageNum = Number(form.age);
              const ageOk = Number.isFinite(ageNum) && ageNum >= 0 && ageNum <= 120;

              // Medvetet enkel validering för att undvika backslash-problem i editorn
              const emailOk = form.email.trim() === "" || (form.email.includes("@") && form.email.includes("."));
              const phoneOk = form.phone.trim() === "" || form.phone.trim().length >= 6;

              const hasContact = form.email.trim() !== "" || form.phone.trim() !== "";

              if (!nameOk) return setFormError("Skriv gärna ditt namn.");
              if (!ageOk) return setFormError("Skriv en giltig ålder.");
              if (!hasContact) return setFormError("Skriv e-post eller telefonnummer så vi kan kontakta dig.");
              if (!emailOk) return setFormError("E-postadressen verkar inte korrekt.");
              if (!phoneOk) return setFormError("Telefonnumret verkar för kort.");

              // Skicka in uppgifterna
		const r = await fetch("/api/interest", {
  			method: "POST",
  			headers: { "Content-Type": "application/json" },
  			body: JSON.stringify(form),
		});

		if (!r.ok) {
  			const data = await r.json().catch(() => ({}));
  			return setFormError(data.error || "Kunde inte skicka. Försök igen.");
		}

		setSubmitted(true);

            }}
          >
            <div>
              <label className="text-sm text-slate-200">Namn</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-2xl bg-slate-950/40 border border-white/15 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                placeholder="För- och efternamn"
                autoComplete="name"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-slate-200">Kön</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                  className="mt-1 w-full rounded-2xl bg-slate-950/40 border border-white/15 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  <option value="">Välj</option>
                  <option value="kvinna">Kvinna</option>
                  <option value="man">Man</option>
                  <option value="annat">Annat</option>
                  <option value="vill-ej-ange">Vill ej ange</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-200">Ålder</label>
                <input
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                  className="mt-1 w-full rounded-2xl bg-slate-950/40 border border-white/15 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  placeholder="t.ex. 52"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-slate-200">E-post</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded-2xl bg-slate-950/40 border border-white/15 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  placeholder="namn@exempel.se"
                  autoComplete="email"
                  type="email"
                />
              </div>

              <div>
                <label className="text-sm text-slate-200">Telefon</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full rounded-2xl bg-slate-950/40 border border-white/15 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  placeholder="07x…"
                  autoComplete="tel"
                  type="tel"
                />
              </div>
            </div>

            {formError && (
              <div className="rounded-2xl border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-sm text-orange-100">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-300 to-orange-800 text-slate-950 font-semibold px-6 py-3 shadow-lg text-sm"
            >
              Skicka intresseanmälan <ChevronRight className="h-4 w-4" />
            </button>

            <p className="text-xs text-slate-400">
              Obs: vi slår upp portarna i juni 2026 men tar gladeligen emot intresseanmälningar! Vi kontaktar dig så fort vi är igång.
            </p>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-2xl font-semibold">Tack!</div>
            <p className="mt-3 text-slate-200">
              Din intresseanmälan är registrerad. Vi återkommer så snart vi kan.
            </p>
            <button
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 px-6 py-3 text-sm"
              onClick={() => {
                setSubmitted(false);
                setFormError("");
                setForm({ name: "", gender: "", age: "", email: "", phone: "" });
              }}
            >
              Skicka en ny <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
</section>


      {/* Filosofi */}
      <section id="filosofi" className="bg-slate-900/60 border-t border-white/15 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-12 items-start">
            <div className="md:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-7">
                <div className="text-xs uppercase tracking-wider text-slate-400">Vår filosofi</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold leading-tight">
                  Proaktiv prevention – upptäck åderförkalkning och dra i bromsen i god tid.
                </h2>
                <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed">
                  Vivra finns för att minska hjärt-kärlsjukdom genom tidig upptäckt och effektiv prevention. Vi är
                  <strong> inte</strong> intresserade av att skanna eller behandla i onödan. Vi vill hjälpa dig fatta ett
                  välgrundat beslut, och vi rekommenderar bara förebyggande behandling när det finns goda skäl.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 p-5">
                  <div className="text-sm font-semibold text-slate-100">Vårt huvudsakliga kriterium</div>
                  <p className="mt-2 text-slate-200 text-sm leading-relaxed">
                    Vår grundfilosofi är ganska enkel: om vi ser <strong>plack i kranskärlen</strong> och man låter det bero är risken överhängande att placken växer och 
                    till slut brister och orsakar en hjärtinfarkt. Därför är det i regel befogat med preventiv behandling som kan bromsa eller stoppa plackutvecklingen. 
                    Behandling består framförallt av att sänka blodfetter, eftersom blodfetter är grundorsaken bakom plackbildning och åderförkalkning.
                  </p>
                </div>

                <div className="mt-6 text-xs text-slate-400">
                  Vi följer medicinsk evidens och arbetar med transparenta rekommendationer.
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-6">
                <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-7">
                  <div className="text-sm font-semibold text-slate-100">Frivillighet och medbestämmande</div>
                  <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed">
                    Vi tror på <strong>frivillighet</strong> och <strong>delat beslutsfattande</strong>. Du kanske föredrar en
                    mer kraftfull behandling eller en försiktigare start. Vi lyssnar
                    på dig och anpassar upplägget så att du når dina mål.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[ 
                      {
                        title: "Om du vill satsa mer",
                        text: "Vi kan jobba mot lägre målnivåer och tätare uppföljning – inom ramarna för vad som är medicinskt rimligt.",
                      },
                      {
                        title: "Om du vill ta det lugnare",
                        text: "Vi kan börja stegvis och justera i takt med dina önskemål.",
                      },
                     
                    ].map((item, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                        <div className="font-medium text-slate-100">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-200">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-6 sm:p-7">
                  <div className="text-sm font-semibold text-slate-100">Varför nu?</div>
                  <p className="mt-6 text-slate-200 text-sm sm:text-base leading-relaxed">
                    Vi som är grundare av Vivra är forskare och läkare som dagligen jobbar med hjärt-kärlsjukdom. Idag vet vi att åderförkalkning är en långsam och mätbar sjukdomsprocess som börjar långt innan den ger symtom. Vi vet också grundorsaken bakom sjukdomen: kolesterolbärande partiklar i blodet, särskilt apoB-innehållande lipoproteiner (LDL, Lp(a) och TG-rika lipoproteiner), driver åderförkalkning över tid. 
                    Samtidigt har vi nu också verktyg för att upptäcka sjukdomen tidigt. Med modern hjärt-CT/DT kan även tyst, subklinisk åderförkalkning visualiseras direkt, långt innan den leder till hjärtinfarkt.
                    Vi har också effektiva och säkra behandlingar. Statiner, ezetimib, PCSK9-hämmare och nya terapier kan kraftigt sänka de partiklar som orsakar sjukdomen, och stora kliniska studier visar att detta leder till färre hjärt-kärlhändelser. 
                    När orsak, mätning och behandling nu finns på plats samtidigt kan vi gå från att reagera på hjärtinfarkter till att förebygga dem. Det är därför tiden är nu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <footer id="kontakt" className="bg-slate-900/60 border-t border-white/15">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-3 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl grid place-items-center shadow-md overflow-hidden">
                <img
                  src="https://i.ibb.co/QFhxFjrm/Chat-GPT-Image-5-jan-2026-09-39-08.png"
                  alt="Vivra logotyp"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-semibold">Vivra</span>
            </div>
            <p className="mt-3 text-slate-400">För din hjärthälsa.</p>
          </div>
          <div>
            <div className="font-medium text-slate-100">Kontakt</div>
            <p className="mt-2 text-slate-400">
              info@vivrahealth.se
              <br />
              Göteborg, Sverige
            </p>
          </div>
          <div>
            <div className="font-medium text-slate-100">Länkar</div>
            <ul className="mt-2 space-y-1 text-slate-400">
              <li>
                <a
                  href="#hur"
                  className="hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#hur");
                  }}
                >
                  Så funkar det
                </a>
              </li>
              <li>
                <a
                  href="#paket"
                  className="hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#paket");
                  }}
                >
                  Paket
                </a>
              </li>
              <li>
                <a
                  href="#exempel"
                  className="hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#exempel");
                  }}
                >
                  Exempel
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#faq");
                  }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#filosofi"
                  className="hover:text-white cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#filosofi");
                  }}
                >
                  Vår filosofi
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
