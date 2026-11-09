import { useLanguage } from "./Language";
import React, { useEffect, useRef, useState, type FormEvent } from "react";
import HeartSchool from "./HeartSchool";
const Arrow = () => <span aria-hidden="true">→</span>;
const REGISTRATION_URL = "https://vivrahealth.curoflow.se/visits?bt=6acf8138a36ea18b24f9ea46";
const PATIENT_PORTAL_URL = "https://vivrahealth.curoflow.se/auth/login";
const LogoMark = () => <span className="logo-mark"><img src="/vivra-logo.png" alt="" width={490} height={345}/></span>;
function RegistrationFallback() {
 const { t, language, setLanguage } = useLanguage();
    const details = useRef<HTMLDetailsElement>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [error, setError] = useState("");
    useEffect(() => {
        const openFallback = () => {
            if (window.location.hash === "#kontakt-alternativ" && details.current)
                details.current.open = true;
        };
        openFallback();
        window.addEventListener("hashchange", openFallback);
        return () => window.removeEventListener("hashchange", openFallback);
    }, []);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (status === "sending")
            return;
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
                setError(response.status === 400 ? t("Kontrollera personnummer och kontaktuppgifter och försök igen.") : t("Det gick inte att skicka just nu. Försök igen eller kontakta oss på info@vivrahealth.se."));
                setStatus("error");
                return;
            }
            form.reset();
            setStatus("success");
        }
        catch {
            setError(t("Vi kunde inte bekräfta att dina uppgifter kom fram. Försök igen eller kontakta oss på info@vivrahealth.se."));
            setStatus("error");
        }
        finally {
            window.clearTimeout(timeout);
        }
    }
    return (<details ref={details} className="registration-fallback" id="kontakt-alternativ">
      <summary>{t("Vill du hellre att vi bara ringer dig?")}</summary>
      <div className="fallback-content">
        <h4>{t("Bli uppringd av oss.")}</h4>
        <p>{t("Lämna dina kontaktuppgifter så ringer vi dig och berättar mer. Detta är en begäran om återuppringning, inte en patientregistrering.")}</p>
        {status === "success" ? <p className="form-status" role="status">{t("Tack! Dina uppgifter har skickats till Vivra. Vi ringer upp dig så snart vi kan och hjälper dig med nästa steg.")}</p> :
            <form className="callback-form" onSubmit={submit} aria-busy={status === "sending"}>
          <div className="callback-fields">
            <label htmlFor="callback-name">{t("Namn")}<input id="callback-name" type="text" name="Namn" autoComplete="name" required maxLength={150}/></label>
            <label htmlFor="callback-pnr">{t("Personnummer")}<input id="callback-pnr" type="text" name="Personnummer" inputMode="numeric" autoComplete="off" placeholder={t("ÅÅÅÅMMDD-XXXX")} pattern="[0-9]{8}-?[0-9]{4}" maxLength={13} required aria-describedby="pnr-hint"/><span id="pnr-hint" className="field-hint">{t("12 siffror, med eller utan bindestreck.")}</span></label>
            <label htmlFor="callback-email">{t("E-post")}<input id="callback-email" type="email" name="E-post" autoComplete="email" required maxLength={254}/></label>
            <label htmlFor="callback-phone">{t("Telefonnummer")}<input id="callback-phone" type="tel" name="Telefon" autoComplete="tel" required minLength={6} maxLength={30}/></label>
          </div>
          <div className="form-honeypot" aria-hidden="true"><label>{t("Webbplats")}<input name="_honey" tabIndex={-1} autoComplete="off"/></label></div>
          <label className="consent-field"><input type="checkbox" name="Samtycke" value="Ja" required/><span>{t("Jag samtycker till att Vivra använder mina uppgifter för att kontakta mig och hjälpa mig med registreringen.")}</span></label>
          <button className="button button-dark callback-button" type="submit" disabled={status === "sending"}>{status === "sending" ? t("Skickar…") : t("Skicka mina uppgifter")}</button>
          {status === "error" && <p className="form-status" role="alert">{error}</p>}
        </form>}
      </div>
    </details>);
}
export default function App() {
 const { t, language, setLanguage } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const [school, setSchool] = useState(window.location.hash === "#hjart-karlskolan");
    useEffect(() => {
        const navigate = () => {
            const isSchool = window.location.hash === "#hjart-karlskolan";
            setSchool(isSchool);
            setMenuOpen(false);
            if (isSchool)
                window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
            else
                requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1) || "top")?.scrollIntoView());
        };
        window.addEventListener("hashchange", navigate);
        return () => window.removeEventListener("hashchange", navigate);
    }, []);
    useEffect(() => { document.title = school ? t("Hjärt-kärlskolan | Vivra Health") : t("Vivra Health – Förebyggande hjärt-kärlvård"); }, [school, t]);
    const menuButton = useRef<HTMLButtonElement>(null);
    function closeMenuOnEscape(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            setMenuOpen(false);
            menuButton.current?.focus();
        }
    }
    return (<main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={t("Vivra, startsida")}><LogoMark /><span className="brand-name">{t("Vivra")}</span></a>
        <nav id="main-navigation" className={`nav-links${menuOpen ? " is-open" : ""}`} aria-label={t("Huvudmeny")} onKeyDown={closeMenuOnEscape} onClick={() => setMenuOpen(false)}>
          <a href="#sa-fungerar-det">{t("Så fungerar det")}</a><a href="#formular">{t("Kom igång")}</a><a href="#priser">{t("Priser")}</a><a href="#faq">{t("Vanliga frågor")}</a><a href="#om-oss">{t("Om oss")}</a><a href="#hjart-karlskolan" aria-current={school ? "page" : undefined}>{t("Hjärt-kärlskolan")}</a>
        </nav>
        <button ref={menuButton} className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)} onKeyDown={closeMenuOnEscape}>
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span> {menuOpen ? t("Stäng") : t("Meny")}
        </button>
        <button className="language-toggle" type="button" onClick={() => setLanguage(language === "sv" ? "en" : "sv")} lang={language === "sv" ? "en" : "sv"} aria-label={language === "sv" ? "Read this website in English" : "Läs webbplatsen på svenska"}>{language === "sv" ? "In English" : "På svenska"}</button>
        <div className="header-actions">
          <a className="portal-button" href={PATIENT_PORTAL_URL}>{t("Mina sidor")}</a>
          <a className="portal-button registration-button" href={REGISTRATION_URL}>{t("Registrera dig hos oss")}</a>
        </div>
      </header>
      {school ? <HeartSchool /> : <>
      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one"/>
        <div className="hero-glow hero-glow-two"/>
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>{t(" Hejdå ")}<br />
              <span>{t("hjärt-kärlsjukdom")}</span>
            </h1>
            <p className="hero-lead">{t(" Visste du att majoriteten av all hjärt-kärlsjukdom kan undvikas? Välkommen till Vivra, en klinik skapad av forskare och läkare med ett syfte: att förebygga hjärt-kärlsjukdom. ")}</p>
            <p className="pilot-notice">{t("Just nu tar vi emot pilotpatienter, främst i Göteborgsområdet.")}</p>
            <div className="hero-actions">
              <a className="button button-light" href="#sa-fungerar-det">{t(" Så fungerar Vivra ")}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section" id="sa-fungerar-det">
        <div className="section-shell">
          <div className="section-heading">
            <div><p className="eyebrow">{t("Så fungerar det")}</p><h2>{t("Tre steg till en tydligare bild av din hjärthälsa.")}</h2></div>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">{t("Steg 1")}</span><h3>{t("Registrera dig hos oss.")}</h3>
              <p>{t("Registrera dig gratis med BankID och fyll i vårt korta hälsoformulär. Vi ringer upp dig, går igenom dina svar och berättar om nästa steg.")}</p>
              <a className="step-link" href={REGISTRATION_URL}>{t("Registrera dig hos oss ")}<Arrow /></a>
              <a className="fallback-link" href="#kontakt-alternativ">{t("Vill du hellre att vi bara ringer dig?")}</a>
            </article>
            <article className="step-card featured-step">
              <span className="step-number">{t("Steg 2")}</span><h3>{t("Prover i din egen takt.")}</h3>
              <p>{t("Efter vårt telefonsamtal och läkarens bedömning skickar vi vid behov remisser till blodprov och en skanning av hjärtat. Skanningen (hjärt-CT) mäter kalk i hjärtats blodkärl – ett tecken på åderförkalkning. Du genomför undersökningarna i din egen takt.")}</p>
              <div className="step-pills"><span>{t("Blodprov")}</span><span>{t("Hjärtskanning")}</span></div>
            </article>
            <article className="step-card">
              <span className="step-number">{t("Steg 3")}</span><h3>{t("Vi går igenom svaren.")}</h3>
              <p>{t("Vi ses i våra lokaler i Mölndal eller via videomöte, om du föredrar det. Tillsammans går vi igenom alla dina provsvar och bedömer om vårt preventionsprogram är aktuellt för dig.")}</p>
            </article>
          </div>
        </div>
      </section>
      <section className="contact-section" id="formular">
        <div className="contact-glow"/>
        <div className="section-shell contact-inner pilot-contact-grid">
          <div className="contact-heading">
            <p className="eyebrow light">{t("Välkommen som pilotpatient i Göteborgsområdet")}</p>
            <h2>{t("Första steget?")}<br />{t("Registrera dig.")}</h2>
          </div>
          <div className="contact-card registration-card">
            <span className="contact-label">{t("Din första kontakt")}</span>
            <h3>{t("Kom igång med BankID.")}</h3>
            <p>{t("Registrera dig med BankID och fyll i ett kort hälsoformulär. Vi ringer upp dig och går igenom dina svar.")}</p>
            <a className="button button-dark registration-cta" href={REGISTRATION_URL}>{t("Registrera dig hos oss ")}<Arrow /></a>
            <p className="registration-note">{t("Registreringen är kostnadsfri. Du väljer ingen besökstid och betalar inget i detta steg.")}</p>
            <RegistrationFallback />
            <div className="existing-patient">
              <p>{t("Redan patient hos Vivra?")}</p>
              <a className="step-link" href={PATIENT_PORTAL_URL}>{t("Logga in på Mina sidor ")}<Arrow /></a>
            </div>
          </div>
        </div>
      </section>
      <section className="services-section" id="priser">
        <div className="section-shell">
          <div className="section-heading"><div><p className="eyebrow">{t("Priser")}</p><h2>{t("Kartlägg först.")}<br />{t("Förebygg över tid.")}</h2></div><p>{t("Efter kartläggningen bedömer vi tillsammans om du är aktuell för Vivras preventionsprogram.")}</p></div>
          <div className="service-grid">
            <article className="service-card start-card">
              <div className="service-card-head"><div><span className="service-tag">{t("En engångskostnad")}</span><h3>{t("Vivra Screening")}</h3></div><div className="price"><strong>3 290</strong><span>{t("kr")}</span></div></div>
              <p className="service-lead">{t("En samlad bild av din hjärt-kärlhälsa och en personlig rekommendation.")}</p>
              <ul><li>{t("Blodprover")}</li><li>{t("Hjärtskanning")}</li><li>{t("Genomgång av alla provsvar med läkare")}</li><li>{t("Möte i Mölndal eller via video")}</li></ul>
              <a className="button button-dark" href={REGISTRATION_URL}>{t("Registrera dig hos oss ")}<Arrow /></a>
            </article>
            <article className="service-card prevention-card">
              <div className="service-card-head"><div><span className="service-tag">{t("Efter medicinsk bedömning")}</span><h3>{t("Vivra Prevention")}</h3></div><div className="price"><strong>199</strong><span>{t("kr/mån")}</span></div></div>
              <p className="service-lead">{t("För dig som är aktuell för löpande prevention, behandling och uppföljning.")}</p>
              <ul><li>{t("En personlig plan för din hjärt-kärlhälsa")}</li><li>{t("Behandling som passar dig")}</li><li>{t("Uppföljning av värden och behandlingsmål")}</li><li>{t("Årliga kontroller")}</li></ul>
              <p className="program-note">{t("Vi går igenom om programmet passar dig vid ditt läkarmöte.")}</p>
            </article>
          </div>
          <p className="pricing-note">{t("Behovet av undersökningar och behandling bedöms individuellt.")}</p>
        </div>
      </section>
      <section className="faq-section" id="faq">
        <div className="section-shell faq-grid">
          <div><p className="eyebrow">{t("Vanliga frågor")}</p><h2>{t("Undrar du något?")}</h2></div>
          <div className="faq-list">
            <details><summary>{t("Hur kommer jag igång? ")}<span>+</span></summary><p>{t("Klicka på ”Registrera dig hos oss”, identifiera dig med BankID och fyll i vårt korta hälsoformulär. Vi ringer upp dig kort efter registreringen för att välkomna dig, förklara undersökningarna och gå igenom dina uppgifter innan vi skickar eventuella remisser. När du är registrerad kan du logga in på ”Mina sidor”. Vi tar just nu emot pilotpatienter, främst i Göteborgsområdet.")}</p></details>
            <details><summary>{t("Hur bokar jag blodprov och skanning av hjärtat? ")}<span>+</span></summary><p>{t("Efter registreringen ringer vi upp dig och förklarar hur blodprov och hjärtskanning (hjärt-CT) går till. Vi går igenom dina uppgifter, svarar på dina frågor och stämmer av att allt är klart inför eventuell remiss. Efter läkarens bedömning skickar vi vid behov remisser och informerar om hur du går vidare. Du genomför blodprovet och skanningen av hjärtat i din egen takt.")}</p></details>
            <details><summary>{t("Var finns vi? ")}<span>+</span></summary><p>{t("Under pilotfasen vänder vi oss främst till dig som bor i Göteborgsområdet. Hjärtskanningen görs hos Evidia Annedal i Göteborg. Blodprov lämnas genom SYNLAB och deras provtagningspartners; vi hjälper dig att hitta ett lämpligt provtagningsställe. Vår egen mottagning finns på GoCo Health Innovation City, Entreprenörsstråket 1c, 3 tr, i Mölndal. Genomgången av dina provsvar kan också ske via video.")}</p><p>{t("Vi planerar att snart utöka till Stockholm, Malmö och Uppsala, och hoppas därefter kunna erbjuda hjärtskanning på ännu fler orter. Blodprov kan redan lämnas på många platser runt om i Sverige. Hör gärna av dig om du är intresserad av Vivra på din ort.")}</p></details>
            <details><summary>{t("Vilka prover och mätningar gör ni? ")}<span>+</span></summary>
              <p>{t("Vi mäter blodfetter och långtidsblodsocker med blodprov och kontrollerar ditt blodtryck. De ger olika pusselbitar som hjälper oss att bedöma din hjärt-kärlhälsa och välja förebyggande åtgärder som passar dig.")}</p>
              <p><strong>{t("LDL-kolesterol och apoB:")}</strong>{t(" LDL-kolesterol visar hur mycket kolesterol som finns i LDL-partiklarna. Dessa partiklar kan fastna i kärlväggen och bidra till åderförkalkning. Apolipoprotein B (apoB) ger ett mått på det totala antalet blodfettspartiklar som kan bidra till åderförkalkning. Tillsammans ger proverna en mer komplett bild än LDL-kolesterol ensamt och hjälper oss att sätta relevanta behandlingsmål.")}</p>
              <p><strong>{t("Lipoprotein(a), Lp(a):")}</strong>{t(" Lp(a) är en kolesterolbärande partikel som liknar LDL men har ett extra protein kopplat till sig. Nivån är till stor del ärftlig och påverkas vanligtvis ganska lite av kost och motion. Ett högt värde kan öka risken för hjärt-kärlsjukdom även om LDL-kolesterolet är normalt. Därför mäter vi Lp(a) separat och tar hänsyn till värdet när vi bedömer hur intensivt övriga riskfaktorer bör behandlas.")}</p>
              <p><strong>{t("Triglycerider:")}</strong>{t(" Triglycerider är en annan typ av fett i blodet. Ett förhöjt värde kan tyda på fler triglyceridrika partiklar och deras restpartiklar, som också kan bidra till åderförkalkning. Provet kompletterar LDL-kolesterol och apoB och hjälper oss att bedöma din blodfettsprofil.")}</p>
              <p><strong>{t("HbA1c:")}</strong>{t(" HbA1c, ibland kallat långtidsblodsocker, speglar den genomsnittliga blodsockernivån under de senaste två till tre månaderna. Det hjälper oss att upptäcka förhöjt blodsocker och bedöma om vidare utredning för diabetes behövs. Diabetes är en viktig riskfaktor för hjärt-kärlsjukdom.")}</p>
              <p><strong>{t("Blodtryck:")}</strong>{t(" Högt blodtryck belastar hjärtat och blodkärlen och ökar risken för bland annat hjärtinfarkt och stroke. Vi kontrollerar därför blodtrycket som en del av kartläggningen.")}</p>
              <p>{t("Vi väger samman resultaten med hjärtskanningen, din sjukdomshistoria och övriga riskfaktorer. Ett enskilt provvärde avgör inte hela bedömningen.")}</p>
            </details>
            <details><summary>{t("Vad är en skanning av hjärtat? ")}<span>+</span></summary><p>{t("Det är en röntgenundersökning av hjärtats kranskärl som visar om det finns kalkinlagringar – ett tecken på åderförkalkning. Undersökningen är enkel och snabb, görs med låg stråldos och bidrar med viktig information i vår bedömning.")}</p></details>
            <details><summary>{t("Måste jag komma till Mölndal? ")}<span>+</span></summary><p>{t("Nej. Genomgången av dina provsvar kan ske i våra lokaler i Mölndal eller via videomöte. Du väljer det som passar dig bäst.")}</p></details>
            <details><summary>{t("Behöver jag gå med i preventionsprogrammet? ")}<span>+</span></summary><p>{t("Vi behandlar inte i onödan. Om du har påvisbar åderförkalkning eller uppfyller våra andra fördefinierade behandlingskriterier så kommer vi erbjuda dig behandling. Om allt ser bra ut så kommer vi i regel inte rekommendera behandling till dig.")}</p><p>{t("Även om du inte behöver behandling nu finns vi kvar. Vi håller kostnadsfritt reda på när det är dags för en ny undersökning och kontaktar dig då – vanligtvis efter 3–4 år. Påminnelsen är en gratis service. Vid nästa undersökning ser vi om allt fortfarande ser bra ut eller om du behöver förebyggande behandling.")}</p></details>
            <details><summary>{t("Behöver alla göra en skanning av hjärtat? ")}<span>+</span></summary><p>{t("Behovet bedöms individuellt utifrån bland annat ålder och risk för hjärt-kärlsjukdom. Våra läkare granskar uppgifterna i ditt hälsoformulär och bedömer vad som passar dig.")}</p></details>
            <details><summary>{t("Måste jag ha symtom? ")}<span>+</span></summary><p>{t("Nej. Vivra arbetar med att bedöma och minska risk innan hjärt-kärlsjukdom ger symtom. Vid akuta bröstsmärtor eller andra akuta symtom ska du ringa 112.")}</p></details>
          </div>
        </div>
      </section>
      <section className="about-section" id="om-oss" aria-labelledby="about-title">
        <div className="section-shell">
          <div className="section-heading">
            <div><p className="eyebrow">{t("Om oss")}</p><h2 id="about-title">{t("Teamet bakom Vivra")}</h2></div>
            <p>{t("Vi är forskare och läkare med expertis inom hjärt-kärlhälsa och en passion för prevention.")}</p>
          </div>
          <div className="team-cards">
            <article className="team-card">
              <div className="studio-portrait"><img className="studio-strip portrait-0" src="/vivra-team-natural.png" alt="Magnus Hiller" width={2048} height={683}/></div>
              <h3>{t("Magnus Hiller")}</h3><p>{t("Kardiolog · VD")}</p>
            </article>
            <article className="team-card">
              <div className="studio-portrait"><img className="studio-strip portrait-1" src="/vivra-team-natural.png" alt="Pär Björklund" width={2048} height={683}/></div>
              <h3>{t("Pär Björklund")}</h3><p>{t("Läkare · Forskare")}</p>
            </article>
            <article className="team-card">
              <div className="studio-portrait"><img className="studio-strip portrait-2" src="/vivra-team-natural.png" alt="Elias Björnson" width={2048} height={683}/></div>
              <h3>{t("Elias Björnson")}</h3><p>{t("Forskare · Vetenskapligt ansvarig")}</p>
            </article>
            <article className="team-card">
              <div className="studio-portrait"><img className="studio-strip portrait-3" src="/vivra-team-natural.png" alt="Carlo Pirazzi" width={2048} height={683}/></div>
              <h3>{t("Carlo Pirazzi")}</h3><p>{t("Kardiolog · Lipidexpert")}</p>
            </article>
          </div>
        </div>
      </section>
      </>}
      <footer className="pilot-footer">
        <div className="section-shell footer-grid">
          <div>
            <a className="brand footer-brand" href="#top" aria-label={t("Vivra, startsida")}><LogoMark /><span className="brand-name">{t("Vivra")}</span></a>
            <p>{t("Förebyggande hjärt-kärlvård, byggd på forskning.")}</p>
          </div>
          <div className="footer-contact">
            <span>{t("Kontakt & besöksadress")}</span>
            <a href="mailto:info@vivrahealth.se">{t("info@vivrahealth.se")}</a>
            <address>{t("GoCo Health Innovation City")}<br />{t("Entreprenörsstråket 1c, 3 tr")}<br />{t("431 53 Mölndal")}</address>
          </div>
        </div>
        <div className="section-shell footer-bottom"><span>{t("© 2026 Vivra Health AB · Org.nr 559582-6503")}</span><span>{t("Vid akuta symtom, ring 112.")}</span></div>
      </footer>
    </main>);
}
