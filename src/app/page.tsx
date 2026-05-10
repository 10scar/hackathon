"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reveals = root.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    reveals.forEach((el) => observer.observe(el));

    const nav = root.querySelector<HTMLElement>("[data-nav]");
    const onScroll = () => {
      if (!nav) return;
      nav.style.background =
        window.scrollY > 50
          ? "rgba(245,240,232,0.97)"
          : "rgba(245,240,232,0.85)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen overflow-x-hidden bg-cream text-ink antialiased"
    >
      {/* NAVIGATION */}
      <nav
        data-nav
        className="fixed inset-x-0 top-0 z-100 flex h-[72px] items-center justify-between border-b border-ink-20 px-[5%] backdrop-blur-md transition-colors duration-300"
      >
        <div className="flex items-center gap-2.5">
          <svg
            className="h-8 w-8"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M16 28 C16 20 9 16 6 10 C10 10 13 12 16 16 C19 12 22 10 26 10 C23 16 16 20 16 28Z"
              fill="#3D5A3E"
            />
            <path
              d="M16 22 C13 18 8 18 8 18 C8 18 11 22 16 22Z"
              fill="#7FAF5F"
              opacity="0.7"
            />
            <path
              d="M16 22 C19 18 24 18 24 18 C24 18 21 22 16 22Z"
              fill="#7FAF5F"
              opacity="0.7"
            />
            <line
              x1="16"
              y1="22"
              x2="16"
              y2="30"
              stroke="#6B4C2A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-[22px] font-medium tracking-tight text-moss">
            Canopy
          </span>
        </div>
        <Link
          href="/login"
          className="rounded-full bg-moss px-[22px] py-2.5 text-sm font-medium tracking-wide text-white-warm transition-[background,transform] duration-200 hover:-translate-y-px hover:bg-moss-lt"
        >
          Acceder
        </Link>
      </nav>

      {/* HERO */}
      <section
        id="hero"
        className="relative grid min-h-svh place-items-center overflow-hidden bg-cream px-[5%] pt-[120px] pb-20"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-100px] right-[-120px] h-[600px] w-[600px] animate-morph bg-leaf opacity-[0.18] rounded-[60%_40%_70%_30%/50%_60%_40%_70%]" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] animate-morph bg-moss opacity-[0.18] [animation-delay:-7s] rounded-[60%_40%_70%_30%/50%_60%_40%_70%]" />
          <span
            className="absolute bottom-0 animate-float-up rounded-full bg-moss opacity-[0.08]"
            style={{
              width: 6,
              height: 6,
              left: "15%",
              animationDuration: "18s",
              animationDelay: "0s",
            }}
          />
          <span
            className="absolute bottom-0 animate-float-up rounded-full bg-moss opacity-[0.08]"
            style={{
              width: 4,
              height: 4,
              left: "35%",
              animationDuration: "14s",
              animationDelay: "3s",
            }}
          />
          <span
            className="absolute bottom-0 animate-float-up rounded-full bg-moss opacity-[0.08]"
            style={{
              width: 8,
              height: 8,
              left: "65%",
              animationDuration: "20s",
              animationDelay: "7s",
            }}
          />
          <span
            className="absolute bottom-0 animate-float-up rounded-full bg-moss opacity-[0.08]"
            style={{
              width: 5,
              height: 5,
              left: "80%",
              animationDuration: "16s",
              animationDelay: "2s",
            }}
          />
          <span
            className="absolute bottom-0 animate-float-up rounded-full bg-moss opacity-[0.08]"
            style={{
              width: 3,
              height: 3,
              left: "50%",
              animationDuration: "12s",
              animationDelay: "5s",
            }}
          />
        </div>

        <div className="relative z-2 grid w-full max-w-[1200px] grid-cols-1 items-center gap-[60px] lg:grid-cols-2">
          <div>
            <span className="mb-7 inline-flex animate-fade-in items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-moss opacity-0 [animation-delay:0.3s]">
              <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-leaf" />
              Agente de retención inteligente
            </span>
            <h1 className="mb-7 animate-fade-in font-display text-[clamp(48px,6vw,80px)] font-light leading-[1.1] tracking-[-0.02em] text-ink opacity-0 [animation-delay:0.5s]">
              Cuando se van,
              <br />
              las señales
              <br />
              <em className="italic text-moss">siempre estuvieron ahí.</em>
            </h1>
            <p className="mb-10 max-w-[420px] animate-fade-in text-lg font-light leading-[1.7] text-ink-60 opacity-0 [animation-delay:0.7s]">
              Los clientes no cancelan de un día para otro. Se desconectan en
              silencio, poco a poco. Canopy lee esas señales antes de que sea
              tarde.
            </p>
            <div className="flex animate-fade-in flex-wrap items-center gap-5 opacity-0 [animation-delay:0.9s]">
              <Link
                href="/register"
                className="rounded-full bg-moss px-[30px] py-3.5 text-[15px] font-medium text-white-warm shadow-btn-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-moss-lt hover:shadow-btn-primary-hover"
              >
                Empezar a retener
              </Link>
              <button
                type="button"
                onClick={() => scrollToId("how")}
                className="cursor-pointer text-[15px] font-normal text-ink-60 underline decoration-ink-20 underline-offset-4 transition-colors duration-200 hover:text-ink"
              >
                Ver cómo funciona →
              </button>
            </div>
          </div>

          <div className="hidden animate-fade-in items-center justify-center opacity-0 [animation-delay:1s] lg:flex">
            <div className="relative h-[420px] w-[380px]">
              <span
                className="absolute h-2 w-2 animate-signal-float rounded-full bg-leaf opacity-0"
                style={{ top: "30%", left: "10%", animationDelay: "1.5s" }}
              >
                <span
                  className="absolute -top-2 -left-2 h-6 w-6 animate-signal-ring rounded-full border border-leaf opacity-0"
                  style={{ animationDelay: "1.5s" }}
                />
              </span>
              <span
                className="absolute h-2 w-2 animate-signal-float rounded-full bg-leaf opacity-0"
                style={{ top: "20%", right: "15%", animationDelay: "2.0s" }}
              >
                <span
                  className="absolute -top-2 -left-2 h-6 w-6 animate-signal-ring rounded-full border border-leaf opacity-0"
                  style={{ animationDelay: "2.0s" }}
                />
              </span>
              <span
                className="absolute h-2 w-2 animate-signal-float rounded-full bg-leaf opacity-0"
                style={{ top: "50%", right: "5%", animationDelay: "2.5s" }}
              >
                <span
                  className="absolute -top-2 -left-2 h-6 w-6 animate-signal-ring rounded-full border border-leaf opacity-0"
                  style={{ animationDelay: "2.5s" }}
                />
              </span>
              <span
                className="absolute h-2 w-2 animate-signal-float rounded-full bg-leaf opacity-0"
                style={{ top: "65%", left: "15%", animationDelay: "1.8s" }}
              >
                <span
                  className="absolute -top-2 -left-2 h-6 w-6 animate-signal-ring rounded-full border border-leaf opacity-0"
                  style={{ animationDelay: "1.8s" }}
                />
              </span>

              <svg
                className="plant-svg block h-full w-full"
                viewBox="0 0 380 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <ellipse cx="190" cy="390" rx="110" ry="18" fill="#6B4C2A" opacity="0.2" />
                <ellipse cx="190" cy="388" rx="80" ry="12" fill="#6B4C2A" opacity="0.15" />
                <path
                  className="stem"
                  d="M190 388 C190 350 185 300 188 240 C191 180 185 140 190 80"
                  stroke="#6B4C2A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <g className="leaf-group" style={{ transformOrigin: "185px 280px" }}>
                  <path d="M185 280 C160 260 130 245 115 225 C140 228 165 245 185 280Z" fill="#3D5A3E" />
                  <path d="M185 280 C160 265 150 250 115 225" stroke="#7FAF5F" strokeWidth="1" opacity="0.6" fill="none" />
                </g>
                <g className="leaf-group" style={{ transformOrigin: "190px 265px" }}>
                  <path d="M190 265 C215 245 248 238 268 218 C242 224 218 242 190 265Z" fill="#3D5A3E" />
                  <path d="M190 265 C215 248 245 235 268 218" stroke="#7FAF5F" strokeWidth="1" opacity="0.6" fill="none" />
                </g>
                <g className="leaf-group" style={{ transformOrigin: "186px 185px" }}>
                  <path d="M186 185 C155 165 125 152 105 132 C132 138 160 158 186 185Z" fill="#5C7D5E" />
                  <path d="M186 185 C158 168 130 152 105 132" stroke="#A8C97F" strokeWidth="1" opacity="0.6" fill="none" />
                </g>
                <g className="leaf-group" style={{ transformOrigin: "191px 140px" }}>
                  <path d="M191 140 C220 118 255 110 278 92 C250 101 222 120 191 140Z" fill="#5C7D5E" />
                  <path d="M191 140 C218 122 250 108 278 92" stroke="#A8C97F" strokeWidth="1" opacity="0.6" fill="none" />
                </g>
                <g className="leaf-group" style={{ transformOrigin: "190px 82px" }}>
                  <path d="M190 82 C178 65 170 52 172 38 C180 50 184 64 190 82Z" fill="#7FAF5F" />
                  <path d="M190 82 C202 65 210 52 208 38 C200 50 196 64 190 82Z" fill="#7FAF5F" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section
        id="problem"
        className="relative overflow-hidden bg-ink py-[140px] px-[5%] text-cream"
      >
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-[60px] lg:grid-cols-[1fr_1.2fr] lg:gap-[100px]">
          <div>
            <span className="reveal mb-5 block text-[11px] font-medium uppercase tracking-[0.14em] text-leaf-lt">
              La raíz del problema
            </span>
            <h2 className="reveal reveal-delay-1 mb-8 font-display text-[clamp(36px,4.5vw,58px)] font-light leading-[1.15] tracking-[-0.02em] text-cream">
              Tu cliente no está enojado.
              <br />
              <em className="italic text-leaf-lt">Está cansado.</em>
            </h2>
            <p className="reveal reveal-delay-2 max-w-[380px] text-[17px] font-light leading-[1.75] text-cream/65">
              Cansado de explicar. De no ser reconocido. De sentir que es un
              número en una cartera, no una relación que alguien cuida.
            </p>
            <p className="reveal reveal-delay-3 mt-5 max-w-[380px] text-[17px] font-light leading-[1.75] text-cream/65">
              Tu equipo tampoco puede más: 40 cuentas, tres herramientas que no
              se hablan, y el cliente que más necesita atención no es el que
              grita. Es el que lleva semanas en silencio.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="reveal reveal-delay-1 relative max-w-[90%] self-start border border-cream/12 bg-cream/[0.07] px-6 py-5 text-[15px] font-light leading-[1.65] text-cream/80 transition-transform duration-200 hover:scale-[1.01] rounded-[4px_16px_16px_16px]">
              <div className="mb-2.5 flex items-center gap-2 text-[11px] font-normal uppercase tracking-[0.06em] opacity-[0.45]">
                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-leaf" />
                Cliente B2B · hace 3 semanas
              </div>
              &ldquo;Cansado de explicar el mismo problema en cada ticket. De
              recibir respuestas que no reconocen mi contexto. Siento que somos
              un número más en su cartera...&rdquo;
            </div>
            <div className="reveal reveal-delay-2 relative max-w-[90%] self-end border border-leaf/20 bg-moss/30 px-6 py-5 text-[15px] font-light leading-[1.65] text-cream/85 transition-transform duration-200 hover:scale-[1.01] rounded-[16px_4px_16px_16px]">
              <div className="mb-2.5 flex flex-row-reverse items-center gap-2 text-[11px] font-normal uppercase tracking-[0.06em] opacity-[0.45]">
                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-leaf" />
                Customer Success
              </div>
              &ldquo;40 cuentas por persona, tres herramientas que no se hablan.
              El cliente que más necesitaba atención llevaba 3 semanas en
              silencio y nadie lo notó.&rdquo;
            </div>
            <div className="reveal reveal-delay-3 mt-12 rounded-xl border border-rust/30 bg-rust/6 p-8">
              <p className="font-display text-[22px] font-normal leading-normal text-cream">
                El churn no empieza cuando cancela.
                <br />
                Empieza el día que siente que{" "}
                <em className="italic text-risk-accent">nadie está mirando.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* METÁFORA */}
      <section
        id="metaphor"
        className="overflow-hidden bg-white-warm py-[160px] px-[5%]"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="reveal mb-[100px] text-center">
            <h2 className="mb-5 font-display text-[clamp(42px,5vw,68px)] font-light leading-[1.12] tracking-tight text-ink">
              Una planta no te avisa.
              <br />
              <em className="italic text-moss">Te lo muestra.</em>
            </h2>
            <p className="mx-auto max-w-[500px] text-lg font-light leading-[1.7] text-ink-60">
              En el color de las hojas, en la tierra seca. Si sabes leer esas
              señales, puedes actuar antes de que sea tarde.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-[20px] shadow-card-hover md:grid-cols-3">
            {[
              {
                signal: "señal de vida",
                title: "Deja de abrir el producto",
                body:
                  "Como una hoja que se inclina lejos de la luz. La frecuencia de uso es el primer indicador que nadie está mirando.",
                delay: "reveal-delay-1",
                icon: (
                  <path d="M24 40 C24 26 14 20 8 12 C16 12 21 17 24 24 C27 17 32 12 40 12 C34 20 24 26 24 40Z" />
                ),
              },
              {
                signal: "señal de estrés",
                title: "Sube más tickets de lo habitual",
                body:
                  "La raíz pide agua a gritos. El volumen y el tono de los tickets revelan lo que las métricas no capturan.",
                delay: "reveal-delay-2",
                icon: (
                  <>
                    <path d="M24 8 L24 28" />
                    <path d="M14 18 C14 18 10 24 10 30 C10 36 16 40 24 40 C32 40 38 36 38 30 C38 24 34 18 34 18" />
                    <path d="M18 24 C20 28 24 30 24 30 C24 30 28 28 30 24" />
                  </>
                ),
              },
              {
                signal: "señal de silencio",
                title: "El campeón deja de responder",
                body:
                  "10 días sin respuesta donde antes tardaba horas. El silencio de quien antes siempre estaba es la señal más elocuente de todas.",
                delay: "reveal-delay-3",
                icon: (
                  <>
                    <path d="M24 12 C24 12 16 18 16 28 C16 34 20 38 24 38" />
                    <path d="M24 12 C24 12 32 18 32 28 C32 34 28 38 24 38" />
                    <circle cx="24" cy="28" r="2" fill="currentColor" />
                  </>
                ),
              },
            ].map((panel) => (
              <div
                key={panel.title}
                className={`reveal ${panel.delay} group relative overflow-hidden bg-cream px-10 py-[52px] transition-colors duration-400 hover:bg-[#EDE7D5]`}
              >
                <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-moss transition-transform duration-500 ease-(--easing) group-hover:scale-x-100" />
                <svg
                  className="mb-7 h-12 w-12 text-moss"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {panel.icon}
                </svg>
                <span className="mb-3.5 block text-xs font-medium uppercase tracking-widest text-leaf">
                  {panel.signal}
                </span>
                <h3 className="mb-4 font-display text-[26px] font-medium leading-tight text-ink">
                  {panel.title}
                </h3>
                <p className="text-[15px] font-light leading-[1.7] text-ink-60">
                  {panel.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="how" className="overflow-hidden bg-cream py-[160px] px-[5%]">
        <div className="mx-auto max-w-[1100px]">
          <span className="reveal mb-5 block text-[11px] font-medium uppercase tracking-[0.14em] text-moss">
            Cómo funciona
          </span>
          <h2 className="reveal reveal-delay-1 mb-20 max-w-full font-display text-[clamp(38px,4.5vw,60px)] font-light leading-[1.12] tracking-tight text-ink md:max-w-[600px]">
            Ve lo que nadie más ve.
            <br />
            <em className="italic text-moss">Entiende. Actúa.</em>
          </h2>
          <div className="flex flex-col">
            {[
              {
                num: "01",
                title: (
                  <>
                    Detecta <em className="italic text-moss">antes</em> de la
                    crisis
                  </>
                ),
                body:
                  "Canopy observa cada cuenta en silencio: frecuencia de uso, tono de los tickets, proximidad del contrato, el silencio de quien antes siempre respondía. Lo detecta cuando todavía es una señal, no una emergencia.",
                delay: "",
              },
              {
                num: "02",
                title: (
                  <>
                    Entiende lo que{" "}
                    <em className="italic text-moss">está sintiendo</em>
                  </>
                ),
                body:
                  "No es lo mismo un cliente frustrado que uno desconectado. No es lo mismo uno que no ve el valor que uno evaluando a la competencia. La respuesta correcta depende de entender qué pasa de verdad, no solo qué dicen los números.",
                delay: "reveal-delay-1",
              },
              {
                num: "03",
                title: (
                  <>
                    Le da al rep{" "}
                    <em className="italic text-moss">exactamente</em> lo que
                    necesita
                  </>
                ),
                body:
                  "No una alerta más. El mensaje correcto, para el contacto correcto, en el tono correcto, listo para enviar. El rep decide. Canopy prepara.",
                delay: "reveal-delay-2",
              },
            ].map((step) => (
              <div
                key={step.num}
                className={`reveal ${step.delay} group/step grid grid-cols-[60px_1fr] gap-6 border-b border-ink-20 py-14 transition-[padding] duration-300 last:border-b-0 hover:pl-2 md:grid-cols-[80px_1fr] md:gap-10`}
              >
                <span className="self-start pt-1 font-display text-[48px] font-light leading-none tracking-[-0.04em] text-sand transition-colors duration-300 group-hover/step:text-leaf-lt md:text-[64px]">
                  {step.num}
                </span>
                <div className="self-start">
                  <h3 className="mb-4 font-display text-[32px] font-medium leading-[1.2] tracking-[-0.01em] text-ink">
                    {step.title}
                  </h3>
                  <p className="max-w-[560px] text-base font-light leading-[1.75] text-ink-60">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section
        id="metrics"
        className="relative overflow-hidden bg-moss py-[140px] px-[5%]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-30px] -left-5 select-none font-display text-[280px] font-light leading-none tracking-tighter text-cream/4"
        >
          $
        </div>
        <div className="relative z-1 mx-auto max-w-[1100px]">
          <div className="mb-20">
            <span className="reveal mb-5 block text-[11px] font-medium uppercase tracking-[0.14em] text-leaf-lt">
              El argumento para el CFO
            </span>
            <h2 className="reveal reveal-delay-1 max-w-[500px] font-display text-[clamp(36px,4vw,52px)] font-light leading-[1.15] tracking-[-0.02em] text-cream">
              Tres números que
              <br />
              justifican la conversación
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-0.5 md:grid-cols-3">
            {[
              {
                num: <>8</>,
                label: "El costo del silencio",
                desc:
                  "En una cartera de 50 clientes enterprise, en promedio 8 entran en riesgo de churn cada mes sin que nadie lo detecte a tiempo.",
                delay: "reveal-delay-1",
              },
              {
                num: (
                  <>
                    $400<span className="text-[32px]">k</span>
                  </>
                ),
                label: "El impacto de actuar antes",
                desc:
                  "Recuperar el 40% de esas cuentas representa hasta 400 mil dólares anuales en MRR retenido, sin adquirir un solo cliente nuevo.",
                delay: "reveal-delay-2",
              },
              {
                num: (
                  <>
                    +5<span className="text-[32px]">h</span>
                  </>
                ),
                label: "El tiempo que se devuelve",
                desc:
                  "Un CS rep invierte entre 3 y 5 horas semanales en detectar y hacer seguimiento manual. Canopy devuelve ese tiempo para usarlo donde hay valor real.",
                delay: "reveal-delay-3",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className={`reveal ${metric.delay} rounded-sm border border-cream/10 bg-cream/6 px-10 py-[52px] transition-colors duration-300 hover:bg-cream/10`}
              >
                <span className="mb-2 block font-display text-[72px] font-light leading-none tracking-[-0.04em] text-cream">
                  {metric.num}
                </span>
                <span className="mb-5 block text-xs font-medium uppercase tracking-widest text-leaf-lt">
                  {metric.label}
                </span>
                <p className="text-[15px] font-light leading-[1.65] text-cream/60">
                  {metric.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section
        id="close"
        className="relative overflow-hidden bg-cream px-[5%] pt-[160px] pb-[120px] text-center"
      >
        {[300, 600, 900, 1200].map((size, i) => (
          <span
            key={size}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-expand-circle rounded-full border border-ink-20 opacity-0"
            style={{
              width: size,
              height: size,
              animationDelay: `${i * 5}s`,
            }}
          />
        ))}

        <div className="relative z-2 mx-auto max-w-[740px]">
          <svg
            className="reveal mx-auto mb-12 h-[60px] w-[60px] text-moss"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M30 54 C30 38 18 30 11 18 C20 18 26 24 30 32 C34 24 40 18 49 18 C42 30 30 38 30 54Z"
              fill="currentColor"
            />
            <path
              d="M30 42 C24 36 14 36 14 36 C14 36 20 42 30 42Z"
              fill="currentColor"
              opacity="0.5"
            />
            <path
              d="M30 42 C36 36 46 36 46 36 C46 36 40 42 30 42Z"
              fill="currentColor"
              opacity="0.5"
            />
            <line
              x1="30"
              y1="50"
              x2="30"
              y2="58"
              stroke="#6B4C2A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <h2 className="reveal reveal-delay-1 mb-8 font-display text-[clamp(40px,5.5vw,70px)] font-light leading-[1.1] tracking-tight text-ink">
            El churn no empieza
            <br />
            cuando cancela.
            <br />
            <em className="italic text-moss">
              Empieza el día que siente
              <br />
              que nadie está mirando.
            </em>
          </h2>

          <p className="reveal reveal-delay-2 mb-6 text-lg font-light leading-[1.75] text-ink-60">
            Cada cuenta que se va en silencio es MRR que no se renovó y una
            relación que pudo haberse salvado. Canopy existe para que eso no
            ocurra.
          </p>

          <p className="reveal reveal-delay-3 mx-auto mb-[60px] max-w-[540px] font-display text-xl font-light italic leading-[1.6] text-moss">
            Las plantas más saludables no son las que nunca pasan por momentos
            difíciles. Son las que tienen a alguien que sabe leer sus señales a
            tiempo.
          </p>

          <div className="reveal reveal-delay-3 mb-[60px] flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-moss/30 bg-transparent px-5 py-2.5 text-[13px] font-normal tracking-[0.02em] text-moss transition-colors duration-200 hover:bg-moss hover:text-white-warm">
              Detecta
            </span>
            <span className="text-lg text-ink-20">·</span>
            <span className="rounded-full border border-moss/30 bg-transparent px-5 py-2.5 text-[13px] font-normal tracking-[0.02em] text-moss transition-colors duration-200 hover:bg-moss hover:text-white-warm">
              Entiende
            </span>
            <span className="text-lg text-ink-20">·</span>
            <span className="rounded-full border border-moss/30 bg-transparent px-5 py-2.5 text-[13px] font-normal tracking-[0.02em] text-moss transition-colors duration-200 hover:bg-moss hover:text-white-warm">
              Actúa
            </span>
            <span className="text-lg text-ink-20">·</span>
            <span className="rounded-full border border-moss/30 bg-transparent px-5 py-2.5 text-[13px] font-normal tracking-[0.02em] text-moss transition-colors duration-200 hover:bg-moss hover:text-white-warm">
              Retiene
            </span>
          </div>

          <Link
            href="/register"
            className="reveal reveal-delay-4 inline-block rounded-full bg-moss px-10 py-[18px] font-sans text-base font-medium tracking-wide text-white-warm shadow-btn-primary transition-all duration-200 hover:-translate-y-0.5 hover:bg-moss-lt hover:shadow-cta-hover"
          >
            Empieza a escuchar las señales
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink px-[5%] py-8 text-center text-[13px] font-light tracking-[0.02em] text-cream/40">
        © 2026 <span className="text-cream/70">Canopy Platform</span> · Todos
        los derechos reservados.
      </footer>
    </div>
  );
}
