import React from "react";

export default function App() {
  return (
    <div
      className="min-h-screen overflow-x-hidden text-stone-50"
      style={{
        backgroundImage:
          "radial-gradient(circle at 8% 12%, rgba(255, 94, 58, 0.95) 0%, rgba(255, 94, 58, 0.55) 14%, transparent 32%), radial-gradient(circle at 28% 78%, rgba(255, 166, 0, 0.75) 0%, rgba(255, 166, 0, 0.22) 16%, transparent 34%), radial-gradient(circle at 82% 18%, rgba(255, 61, 113, 0.75) 0%, rgba(255, 61, 113, 0.24) 16%, transparent 34%), radial-gradient(circle at 74% 72%, rgba(255, 115, 0, 0.7) 0%, rgba(255, 115, 0, 0.18) 18%, transparent 38%), radial-gradient(circle at 52% 42%, rgba(255, 205, 86, 0.28) 0%, rgba(255, 205, 86, 0.08) 14%, transparent 28%), linear-gradient(140deg, #250a05 0%, #5a1608 22%, #8d2b0b 42%, #45100a 64%, #16070d 100%)",
      }}
    >
      <div className="relative isolate min-h-screen w-full overflow-x-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="absolute left-[-10rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-red-400/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-[4rem] h-[22rem] w-[22rem] rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[8%] h-[22rem] w-[22rem] rounded-full bg-amber-300/15 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[10%] h-[24rem] w-[24rem] rounded-full bg-orange-500/15 blur-3xl" />

        <header className="relative z-10">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-[1.4rem] bg-white/30 p-1 shadow-[0_0_24px_rgba(255,255,255,0.12)] ring-1 ring-white/20 backdrop-blur-xl sm:h-24 sm:w-24 sm:rounded-[1.75rem]">
                <img
                  src="https://i.ibb.co/QFhxFjrm/Chat-GPT-Image-5-jan-2026-09-39-08.png"
                  alt="Vivra logotyp"
                  className="h-full w-full scale-110 object-cover"
                />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight sm:text-2xl">Vivra</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">Pre-launch</div>
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm sm:text-xs sm:tracking-[0.18em]">
              Öppnar portarna september 2026
            </div>
          </div>
        </header>

        <main className="relative z-10">
          <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center px-5 pb-24 pt-4 sm:px-8 sm:pb-40 sm:pt-10 lg:px-10">
            <div className="max-w-5xl">
              <h1 className="mt-4 text-[3rem] font-semibold leading-[1.02] tracking-tight text-white sm:mt-8 sm:text-6xl lg:text-[7rem]">
                <span className="block">Hejdå</span>
                <span className="bg-gradient-to-r from-orange-100 via-amber-200 to-rose-200 bg-clip-text text-transparent text-[2.7rem] leading-[1.05] sm:text-6xl sm:whitespace-nowrap">
                  hjärt-kärlsjukdom
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:mt-8 sm:text-xl sm:leading-8">
                Visste du att majoriteten av all hjärt-kärlsjukdom kan undvikas? Välkommen till Vivra, en klinik skapad av forskare och läkare med ett syfte: att förebygga hjärt-kärlsjukdom.
              </p>

              <div className="mt-6 max-w-md sm:mt-8">
                <div className="text-sm text-white/80">
                  Intresserad? Lämna din e-post så hör vi av oss när vi öppnar.
                </div>
                <form
                  className="mt-3 flex w-full items-center gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

                    try {
                      const res = await fetch("/api/interest", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name: "",
                          gender: "",
                          age: "",
                          email,
                          phone: "",
                        }),
                      });

                      if (res.ok) {
                        form.reset();
                        alert("Tack! Vi hör av oss när vi öppnar.");
                      } else {
                        alert("Något gick fel. Försök igen.");
                      }
                    } catch (err) {
                      alert("Något gick fel. Försök igen.");
                    }
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Din e-postadress"
                    aria-label="E-postadress"
                    className="flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-white px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-white/90"
                  >
                    Skicka
                  </button>
                </form>

                <div className="mt-3 text-[10px] text-white/50">
                  Genom att anmäla dig godkänner du att vi kontaktar dig inför lanseringen.
                </div>

                <div className="mt-6 text-sm text-white/70">
                  info@vivrahealth.se
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
