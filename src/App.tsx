import React, { useState } from "react";
import type { FormEvent } from "react";
const Arrow = () => <span aria-hidden="true">→</span>;
const FORM_URL = "#formular";
const LogoMark = () => <span className="logo-mark"><img src="/vivra-logo.png" alt="" width={490} height={345} /></span>;
export default function App() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus("sending");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: fields.get("Namn"),
          birthDate: fields.get("Födelsedatum"),
          email: fields.get("E-post"),
          phone: fields.get("Telefon"),
          consent: fields.get("Samtycke") === "Ja",
          website: fields.get("_honey"),
        }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("Submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
    }
  }
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Vivra, startsida"><LogoMark /><span className="brand-name">Vivra</span></a>
        <nav className="nav-links" aria-label="Huvudmeny">
          <a href="#sa-fungerar-det">Så fungerar det</a><a href="#priser">Priser</a><a href="#faq">Vanliga frågor</a>
        </nav>
        <a className="portal-button" href={FORM_URL}>Bli uppringd</a>
      </header>
      <section className="hero" id="top">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow light">Förebyggande hjärt-kärlvård</p>
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
              <a className="button button-light" href={FORM_URL}>
                Lämna dina kontaktuppgifter
              </a>
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
            <p>Under pilotfasen vänder vi oss främst till dig i Göteborgsområdet. Allt börjar med ett telefonsamtal – vi hjälper dig genom resten.</p>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">Steg 1</span><h3>Vi ringer dig.</h3>
              <p>Lämna ditt namn, telefonnummer och e-post. Vi ringer upp, ställer några enkla frågor och berättar hur allt går till.</p>
              <a className="step-link" href={FORM_URL}>Lämna dina kontaktuppgifter <Arrow /></a>
            </article>
            <article className="step-card featured-step">
              <span className="step-number">Steg 2</span><h3>Prover i din egen takt.</h3>
              <p>Efter samtalet skickar vi remisser till blodprov och en skanning av hjärtat. Skanningen (hjärt-CT) mäter kalk i hjärtats blodkärl – ett tecken på åderförkalkning. Du genomför undersökningarna i din egen takt.</p>
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
            <h2>Första steget?<br />Vi hörs.</h2>
            <p>Lämna dina kontaktuppgifter så ringer vi dig och berättar mer om kartläggningen.</p>

          </div>
            <form
              className="contact-card callback-form"
              onSubmit={submitContact}
              aria-busy={status === "sending"}
            >
              <input className="form-honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off" />

              <span className="contact-label">Din första kontakt</span>
              <h3>Vi hör av oss till dig.</h3>
              <p>
                Lämna namn, födelsedatum, telefonnummer och e-post så ringer vi dig för
                ett första samtal.
              </p>

              <label htmlFor="callback-name">Namn</label>
              <input id="callback-name" name="Namn" type="text" autoComplete="name" required />

              <label htmlFor="callback-birthdate">Födelsedatum</label>
              <input id="callback-birthdate" name="Födelsedatum" type="date" autoComplete="bday" min="1900-01-01" max={new Date().toISOString().slice(0, 10)} aria-describedby="callback-birthdate-hint" required />
              <p id="callback-birthdate-hint" className="field-hint">År, månad och dag – inga fyra sista siffror.</p>

              <div className="callback-fields">
                <div>
                  <label htmlFor="callback-email">Mejladress</label>
                  <input id="callback-email" name="E-post" type="email" autoComplete="email" required />
                </div>
                <div>
                  <label htmlFor="callback-phone">Telefonnummer</label>
                  <input id="callback-phone" name="Telefon" type="tel" autoComplete="tel" required />
                </div>
              </div>

              <label className="consent-field">
                <input name="Samtycke" type="checkbox" value="Ja" required />
                <span>Jag samtycker till att Vivra kontaktar mig.</span>
              </label>
              <p className="privacy-note">
                Skriv inte känsliga medicinska uppgifter i detta formulär.
              </p>
              <button className="button callback-button" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Skickar…" : "Ring upp mig"} <Arrow />
              </button>
              <div className="form-status" aria-live="polite" aria-atomic="true">
                {status === "success" && <p>Tack! Vi har fått dina uppgifter och hör av oss till dig.</p>}
                {status === "error" && <p>Det gick inte att skicka dina uppgifter. Försök igen eller kontakta oss på <a href="mailto:info@vivrahealth.se">info@vivrahealth.se</a>.</p>}
              </div>
            </form>
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
              <a className="button button-dark" href={FORM_URL}>Lämna dina kontaktuppgifter <Arrow /></a>
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
            <details><summary>Hur kommer jag igång? <span>+</span></summary><p>Lämna ditt namn, telefonnummer och e-post i formuläret. Vi ringer dig, ställer några enkla frågor och berättar hur undersökningarna och uppföljningen går till. Vi tar just nu emot pilotpatienter, främst i Göteborgsområdet.</p></details>
            <details><summary>Hur bokar jag blodprov och skanning av hjärtat? <span>+</span></summary><p>Vi skickar remisser efter vårt första telefonsamtal och informerar om hur du går vidare. Du genomför blodprovet och skanningen av hjärtat i din egen takt.</p></details>
            <details><summary>Var finns vi? <span>+</span></summary><p>Under pilotfasen vänder vi oss främst till dig som bor i Göteborgsområdet. Hjärtskanningen görs hos Evidia Annedal i Göteborg. Blodprov lämnas genom SYNLAB och deras provtagningspartners; vi hjälper dig att hitta ett lämpligt provtagningsställe. Vår egen mottagning finns på GoCo Health Innovation City, Entreprenörsstråket 1c, 3 tr, i Mölndal. Genomgången av dina provsvar kan också ske via video.</p><p>Vi planerar att snart utöka till Stockholm, Malmö och Uppsala, och hoppas därefter kunna erbjuda hjärtskanning på ännu fler orter. Blodprov kan redan lämnas på många platser runt om i Sverige. Hör gärna av dig om du är intresserad av Vivra på din ort.</p></details>
            <details><summary>Vad är en skanning av hjärtat? <span>+</span></summary><p>Det är en röntgenundersökning av hjärtats kranskärl som visar om det finns kalkinlagringar – ett tecken på åderförkalkning. Undersökningen är enkel och snabb, görs med låg stråldos och bidrar med viktig information i vår bedömning.</p></details>
            <details><summary>Måste jag komma till Mölndal? <span>+</span></summary><p>Nej. Genomgången av dina provsvar kan ske i våra lokaler i Mölndal eller via videomöte. Du väljer det som passar dig bäst.</p></details>
            <details><summary>Behöver jag gå med i preventionsprogrammet? <span>+</span></summary><p>Vi behandlar inte i onödan. Om du har påvisbar åderförkalkning eller uppfyller våra andra fördefinierade behandlingskriterier så kommer vi erbjuda dig behandling. Om allt ser bra ut så kommer vi i regel inte rekommendera behandling till dig.</p><p>Även om du inte behöver behandling nu finns vi kvar. Vi håller kostnadsfritt reda på när det är dags för en ny undersökning och kontaktar dig då – vanligtvis efter 3–4 år. Påminnelsen är en gratis service. Vid nästa undersökning ser vi om allt fortfarande ser bra ut eller om du behöver förebyggande behandling.</p></details>
            <details><summary>Behöver alla göra en skanning av hjärtat? <span>+</span></summary><p>Behovet bedöms individuellt utifrån bland annat ålder och risk för hjärt-kärlsjukdom. Vi går igenom vad som passar dig under det första samtalet.</p></details>
            <details><summary>Måste jag ha symtom? <span>+</span></summary><p>Nej. Vivra arbetar med att bedöma och minska risk innan hjärt-kärlsjukdom ger symtom. Vid akuta bröstsmärtor eller andra akuta symtom ska du ringa 112.</p></details>
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
        <div className="section-shell footer-bottom"><span>© 2026 Vivra Health</span><span>Vid akuta symtom, ring 112.</span></div>
      </footer>
    </main>
  );
}
