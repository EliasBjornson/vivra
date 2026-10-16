import React, { useEffect, useRef, useState, type FormEvent } from "react";
const Arrow = () => <span aria-hidden="true">→</span>;
const REGISTRATION_URL = "https://vivrahealth.curoflow.se/visits?bt=6acf8138a36ea18b24f9ea46";
const PATIENT_PORTAL_URL = "https://vivrahealth.curoflow.se/auth/login";
const LogoMark = () => <span className="logo-mark"><img src="/vivra-logo.png" alt="" width={490} height={345} /></span>;

function RegistrationFallback() {
  const details = useRef<HTMLDetailsElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    const openFallback = () => {
      if (window.location.hash === "#kontakt-alternativ" && details.current) details.current.open = true;
    };
    openFallback();
    window.addEventListener("hashchange", openFallback);
    return () => window.removeEventListener("hashchange", openFallback);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    setStatus("sending");
    try {
      const response = await fetch("/api/interest", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({
          name: fields.get("Namn"), personalNumber: fields.get("Personnummer"),
          email: fields.get("E-post"), phone: fields.get("Telefon"),
          consent: fields.get("Samtycke") === "Ja", website: fields.get("_honey")
        })
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setError(response.status === 400 ? "Kontrollera personnummer och kontaktuppgifter och försök igen." : "Det gick inte att skicka just nu. Försök igen eller kontakta oss på info@vivrahealth.se.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setError("Vi kunde inte bekräfta att dina uppgifter kom fram. Försök igen eller kontakta oss på info@vivrahealth.se.");
      setStatus("error");
    } finally { window.clearTimeout(timeout); }
  }
  return (
    <details ref={details} className="registration-fallback" id="kontakt-alternativ">
      <summary>Vill du hellre att vi ringer dig?</summary>
      <div className="fallback-content">
        <h4>Bli uppringd av oss.</h4>
        <p>Lämna dina kontaktuppgifter så ringer vi dig och berättar mer. Detta är en begäran om återuppringning, inte en patientregistrering.</p>
        {status === "success" ? <p className="form-status" role="status">Tack! Dina uppgifter har skickats till Vivra. Vi ringer upp dig så snart vi kan och hjälper dig med nästa steg.</p> :
        <form className="callback-form" onSubmit={submit} aria-busy={status === "sending"}>
          <div className="callback-fields">
            <label htmlFor="callback-name">Namn<input id="callback-name" type="text" name="Namn" autoComplete="name" required maxLength={150} /></label>
            <label htmlFor="callback-pnr">Personnummer<input id="callback-pnr" type="text" name="Personnummer" inputMode="numeric" autoComplete="off" placeholder="ÅÅÅÅMMDD-XXXX" pattern="[0-9]{8}-?[0-9]{4}" maxLength={13} required aria-describedby="pnr-hint" /><span id="pnr-hint" className="field-hint">12 siffror, med eller utan bindestreck.</span></label>
            <label htmlFor="callback-email">E-post<input id="callback-email" type="email" name="E-post" autoComplete="email" required maxLength={254} /></label>
            <label htmlFor="callback-phone">Telefonnummer<input id="callback-phone" type="tel" name="Telefon" autoComplete="tel" required minLength={6} maxLength={30} /></label>
          </div>
          <div className="form-honeypot" aria-hidden="true"><label>Webbplats<input name="_honey" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="consent-field"><input type="checkbox" name="Samtycke" value="Ja" required /><span>Jag samtycker till att Vivra använder mina uppgifter för att kontakta mig och hjälpa mig med registreringen.</span></label>
          <button className="button button-dark callback-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Skickar…" : "Skicka mina uppgifter"}</button>
          {status === "error" && <p className="form-status" role="alert">{error}</p>}
        </form>}
      </div>
    </details>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  function closeMenuOnEscape(event: React.KeyboardEvent) {
    if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
  }
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Vivra, startsida"><LogoMark /><span className="brand-name">Vivra</span></a>
        <nav id="main-navigation" className={`nav-links${menuOpen ? " is-open" : ""}`} aria-label="Huvudmeny" onKeyDown={closeMenuOnEscape} onClick={() => setMenuOpen(false)}>
          <a href="#sa-fungerar-det">Så fungerar det</a><a href="#formular">Kom igång</a><a href="#priser">Priser</a><a href="#faq">Vanliga frågor</a><a href="#om-oss">Om oss</a>
        </nav>
        <button ref={menuButton} className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)} onKeyDown={closeMenuOnEscape}>
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span> {menuOpen ? "Stäng" : "Meny"}
        </button>
        <div className="header-actions">
          <a className="portal-button" href={PATIENT_PORTAL_URL}>Mina sidor</a>
          <a className="portal-button registration-button" href={REGISTRATION_URL}>Registrera dig hos oss</a>
        </div>
      </header>
      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>
              Hejdå
              <br />
              <span>hjärt-kärlsjukdom</span>
            </h1>
            <p className="hero-lead">
              Visste du att majoriteten av all hjärt-kärlsjukdom kan undvikas?
              Välkommen till Vivra, en klinik skapad av forskare och läkare
              med ett syfte: att förebygga hjärt-kärlsjukdom.
            </p>
            <p className="pilot-notice">Just nu tar vi emot pilotpatienter, främst i Göteborgsområdet.</p>
            <div className="hero-actions">
              <a className="button button-light" href="#sa-fungerar-det">
                Så fungerar Vivra
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section" id="sa-fungerar-det">
        <div className="section-shell">
          <div className="section-heading">
            <div><p className="eyebrow">Så fungerar det</p><h2>Tre steg till en tydligare bild av din hjärthälsa.</h2></div>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">Steg 1</span><h3>Registrera dig hos oss.</h3>
              <p>Registrera dig med BankID och fyll i vårt korta hälsoformulär. Vi ringer upp dig, går igenom dina svar och berättar om nästa steg.</p>
              <a className="step-link" href={REGISTRATION_URL}>Registrera dig hos oss <Arrow /></a>
              <a className="fallback-link" href="#kontakt-alternativ">Vill du hellre att vi ringer dig?</a>
            </article>
            <article className="step-card featured-step">
              <span className="step-number">Steg 2</span><h3>Prover i din egen takt.</h3>
              <p>Efter vårt telefonsamtal och läkarens bedömning skickar vi vid behov remisser till blodprov och en skanning av hjärtat. Skanningen (hjärt-CT) mäter kalk i hjärtats blodkärl – ett tecken på åderförkalkning. Du genomför undersökningarna i din egen takt.</p>
              <div className="step-pills"><span>Blodprov</span><span>Hjärtskanning</span></div>
            </article>
            <article className="step-card">
              <span className="step-number">Steg 3</span><h3>Vi går igenom svaren.</h3>
              <p>Vi ses i våra lokaler i Mölndal eller via videomöte, om du föredrar det. Tillsammans går vi igenom alla dina provsvar och bedömer om vårt preventionsprogram är aktuellt för dig.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="contact-section" id="formular">
        <div className="contact-glow" />
        <div className="section-shell contact-inner pilot-contact-grid">
          <div className="contact-heading">
            <p className="eyebrow light">Välkommen som pilotpatient i Göteborgsområdet</p>
            <h2>Första steget?<br />Registrera dig.</h2>
          </div>
          <div className="contact-card registration-card">
            <span className="contact-label">Din första kontakt</span>
            <h3>Kom igång med BankID.</h3>
            <p>Registrera dig med BankID och fyll i ett kort hälsoformulär. Vi ringer upp dig och går igenom dina svar.</p>
            <a className="button button-dark registration-cta" href={REGISTRATION_URL}>Registrera dig hos oss <Arrow /></a>
            <p className="registration-note">Registreringen är kostnadsfri. Du väljer ingen besökstid och betalar inget i detta steg.</p>
            <RegistrationFallback />
            <div className="existing-patient">
              <p>Redan patient hos Vivra?</p>
              <a className="step-link" href={PATIENT_PORTAL_URL}>Logga in på Mina sidor <Arrow /></a>
            </div>
          </div>
        </div>
      </section>
      <section className="services-section" id="priser">
        <div className="section-shell">
          <div className="section-heading"><div><p className="eyebrow">Priser</p><h2>Kartlägg först.<br />Förebygg över tid.</h2></div><p>Efter kartläggningen bedömer vi tillsammans om du är aktuell för Vivras preventionsprogram.</p></div>
          <div className="service-grid">
            <article className="service-card start-card">
              <div className="service-card-head"><div><span className="service-tag">En engångskostnad</span><h3>Vivra Screening</h3></div><div className="price"><strong>3 290</strong><span>kr</span></div></div>
              <p className="service-lead">En samlad bild av din hjärt-kärlhälsa och en personlig rekommendation.</p>
              <ul><li>Blodprover</li><li>Hjärtskanning</li><li>Genomgång av alla provsvar med läkare</li><li>Möte i Mölndal eller via video</li></ul>
              <a className="button button-dark" href={REGISTRATION_URL}>Registrera dig hos oss <Arrow /></a>
            </article>
            <article className="service-card prevention-card">
              <div className="service-card-head"><div><span className="service-tag">Efter medicinsk bedömning</span><h3>Vivra Prevention</h3></div><div className="price"><strong>199</strong><span>kr/mån</span></div></div>
              <p className="service-lead">För dig som är aktuell för löpande prevention, behandling och uppföljning.</p>
              <ul><li>En personlig plan för din hjärt-kärlhälsa</li><li>Behandling som passar dig</li><li>Uppföljning av värden och behandlingsmål</li><li>Årliga kontroller</li></ul>
              <p className="program-note">Vi går igenom om programmet passar dig vid ditt läkarmöte.</p>
            </article>
          </div>
          <p className="pricing-note">Behovet av undersökningar och behandling bedöms individuellt.</p>
        </div>
      </section>
      <section className="faq-section" id="faq">
        <div className="section-shell faq-grid">
          <div><p className="eyebrow">Vanliga frågor</p><h2>Undrar du något?</h2></div>
          <div className="faq-list">
            <details><summary>Hur kommer jag igång? <span>+</span></summary><p>Klicka på ”Registrera dig hos oss”, identifiera dig med BankID och fyll i vårt korta hälsoformulär. Vi ringer upp dig kort efter registreringen för att välkomna dig, förklara undersökningarna och gå igenom dina uppgifter innan vi skickar eventuella remisser. När du är registrerad kan du logga in på ”Mina sidor”. Vi tar just nu emot pilotpatienter, främst i Göteborgsområdet.</p></details>
            <details><summary>Hur bokar jag blodprov och skanning av hjärtat? <span>+</span></summary><p>Efter registreringen ringer vi upp dig och förklarar hur blodprov och hjärtskanning (hjärt-CT) går till. Vi går igenom dina uppgifter, svarar på dina frågor och stämmer av att allt är klart inför eventuell remiss. Efter läkarens bedömning skickar vi vid behov remisser och informerar om hur du går vidare. Du genomför blodprovet och skanningen av hjärtat i din egen takt.</p></details>
            <details><summary>Var finns vi? <span>+</span></summary><p>Under pilotfasen vänder vi oss främst till dig som bor i Göteborgsområdet. Hjärtskanningen görs hos Evidia Annedal i Göteborg. Blodprov lämnas genom SYNLAB och deras provtagningspartners; vi hjälper dig att hitta ett lämpligt provtagningsställe. Vår egen mottagning finns på GoCo Health Innovation City, Entreprenörsstråket 1c, 3 tr, i Mölndal. Genomgången av dina provsvar kan också ske via video.</p><p>Vi planerar att snart utöka till Stockholm, Malmö och Uppsala, och hoppas därefter kunna erbjuda hjärtskanning på ännu fler orter. Blodprov kan redan lämnas på många platser runt om i Sverige. Hör gärna av dig om du är intresserad av Vivra på din ort.</p></details>
            <details><summary>Vilka prover och mätningar gör ni? <span>+</span></summary>
              <p>Vi mäter blodfetter och långtidsblodsocker med blodprov och kontrollerar ditt blodtryck. De ger olika pusselbitar som hjälper oss att bedöma din hjärt-kärlhälsa och välja förebyggande åtgärder som passar dig.</p>
              <p><strong>LDL-kolesterol och apoB:</strong> LDL-kolesterol visar hur mycket kolesterol som finns i LDL-partiklarna. Dessa partiklar kan fastna i kärlväggen och bidra till åderförkalkning. Apolipoprotein B (apoB) ger ett mått på det totala antalet blodfettspartiklar som kan bidra till åderförkalkning. Tillsammans ger proverna en mer komplett bild än LDL-kolesterol ensamt och hjälper oss att sätta relevanta behandlingsmål.</p>
              <p><strong>Lipoprotein(a), Lp(a):</strong> Lp(a) är en kolesterolbärande partikel som liknar LDL men har ett extra protein kopplat till sig. Nivån är till stor del ärftlig och påverkas vanligtvis ganska lite av kost och motion. Ett högt värde kan öka risken för hjärt-kärlsjukdom även om LDL-kolesterolet är normalt. Därför mäter vi Lp(a) separat och tar hänsyn till värdet när vi bedömer hur intensivt övriga riskfaktorer bör behandlas.</p>
              <p><strong>Triglycerider:</strong> Triglycerider är en annan typ av fett i blodet. Ett förhöjt värde kan tyda på fler triglyceridrika partiklar och deras restpartiklar, som också kan bidra till åderförkalkning. Provet kompletterar LDL-kolesterol och apoB och hjälper oss att bedöma din blodfettsprofil.</p>
              <p><strong>HbA1c:</strong> HbA1c, ibland kallat långtidsblodsocker, speglar den genomsnittliga blodsockernivån under de senaste två till tre månaderna. Det hjälper oss att upptäcka förhöjt blodsocker och bedöma om vidare utredning för diabetes behövs. Diabetes är en viktig riskfaktor för hjärt-kärlsjukdom.</p>
              <p><strong>Blodtryck:</strong> Högt blodtryck belastar hjärtat och blodkärlen och ökar risken för bland annat hjärtinfarkt och stroke. Vi kontrollerar därför blodtrycket som en del av kartläggningen.</p>
              <p>Vi väger samman resultaten med hjärtskanningen, din sjukdomshistoria och övriga riskfaktorer. Ett enskilt provvärde avgör inte hela bedömningen.</p>
            </details>
            <details><summary>Vad är en skanning av hjärtat? <span>+</span></summary><p>Det är en röntgenundersökning av hjärtats kranskärl som visar om det finns kalkinlagringar – ett tecken på åderförkalkning. Undersökningen är enkel och snabb, görs med låg stråldos och bidrar med viktig information i vår bedömning.</p></details>
            <details><summary>Måste jag komma till Mölndal? <span>+</span></summary><p>Nej. Genomgången av dina provsvar kan ske i våra lokaler i Mölndal eller via videomöte. Du väljer det som passar dig bäst.</p></details>
            <details><summary>Behöver jag gå med i preventionsprogrammet? <span>+</span></summary><p>Vi behandlar inte i onödan. Om du har påvisbar åderförkalkning eller uppfyller våra andra fördefinierade behandlingskriterier så kommer vi erbjuda dig behandling. Om allt ser bra ut så kommer vi i regel inte rekommendera behandling till dig.</p><p>Även om du inte behöver behandling nu finns vi kvar. Vi håller kostnadsfritt reda på när det är dags för en ny undersökning och kontaktar dig då – vanligtvis efter 3–4 år. Påminnelsen är en gratis service. Vid nästa undersökning ser vi om allt fortfarande ser bra ut eller om du behöver förebyggande behandling.</p></details>
            <details><summary>Behöver alla göra en skanning av hjärtat? <span>+</span></summary><p>Behovet bedöms individuellt utifrån bland annat ålder och risk för hjärt-kärlsjukdom. Våra läkare granskar uppgifterna i ditt hälsoformulär och bedömer vad som passar dig.</p></details>
            <details><summary>Måste jag ha symtom? <span>+</span></summary><p>Nej. Vivra arbetar med att bedöma och minska risk innan hjärt-kärlsjukdom ger symtom. Vid akuta bröstsmärtor eller andra akuta symtom ska du ringa 112.</p></details>
          </div>
        </div>
      </section>
      <section className="about-section" id="om-oss" aria-labelledby="about-title">
        <div className="section-shell">
          <div className="section-heading">
            <div><p className="eyebrow">Om oss</p><h2 id="about-title">Teamet bakom Vivra</h2></div>
            <p>Vi är forskare och läkare med expertis inom hjärt-kärlhälsa och en passion för prevention.</p>
          </div>
          <div className="team-cards">
            <article className="team-card">
              <div className="studio-portrait"><img className="studio-strip portrait-0" src="/vivra-team-natural.png" alt="Magnus Hiller" width={2048} height={683} /></div>
              <h3>Magnus Hiller</h3><p>Kardiolog · VD</p>
            </article>
            <article className="team-card">
              <div className="studio-portrait"><img className="studio-strip portrait-1" src="/vivra-team-natural.png" alt="Pär Björklund" width={2048} height={683} /></div>
              <h3>Pär Björklund</h3><p>Läkare · Forskare</p>
            </article>
            <article className="team-card">
              <div className="studio-portrait"><img className="studio-strip portrait-2" src="/vivra-team-natural.png" alt="Elias Björnson" width={2048} height={683} /></div>
              <h3>Elias Björnson</h3><p>Forskare · Vetenskapligt ansvarig</p>
            </article>
            <article className="team-card">
              <div className="studio-portrait"><img className="studio-strip portrait-3" src="/vivra-team-natural.png" alt="Carlo Pirazzi" width={2048} height={683} /></div>
              <h3>Carlo Pirazzi</h3><p>Kardiolog · Lipidexpert</p>
            </article>
          </div>
        </div>
      </section>
      <footer className="pilot-footer">
        <div className="section-shell footer-grid">
          <div>
            <a className="brand footer-brand" href="#top" aria-label="Vivra, startsida"><LogoMark /><span className="brand-name">Vivra</span></a>
            <p>Förebyggande hjärt-kärlvård, byggd på forskning.</p>
          </div>
          <div className="footer-contact">
            <span>Kontakt &amp; besöksadress</span>
            <a href="mailto:info@vivrahealth.se">info@vivrahealth.se</a>
            <address>GoCo Health Innovation City<br />Entreprenörsstråket 1c, 3 tr<br />431 53 Mölndal</address>
          </div>
        </div>
        <div className="section-shell footer-bottom"><span>© 2026 Vivra Health AB · Org.nr 559582-6503</span><span>Vid akuta symtom, ring 112.</span></div>
      </footer>
    </main>
  );
}

