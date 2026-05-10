"use client";

import { useEffect, useRef } from "react";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function CanopyLanding() {
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

    const nav = root.querySelector("nav");
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
    <div ref={rootRef} className="canopy-landing min-h-screen">
      <nav>
        <div className="nav-logo">
          <svg
            className="nav-logo-mark"
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
          <span className="nav-wordmark">Canopy</span>
        </div>
        <button type="button" className="nav-cta">
          Acceder
        </button>
      </nav>

      <section id="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div
            className="particle"
            style={{
              width: 6,
              height: 6,
              left: "15%",
              bottom: 0,
              animationDuration: "18s",
              animationDelay: "0s",
            }}
          />
          <div
            className="particle"
            style={{
              width: 4,
              height: 4,
              left: "35%",
              bottom: 0,
              animationDuration: "14s",
              animationDelay: "3s",
            }}
          />
          <div
            className="particle"
            style={{
              width: 8,
              height: 8,
              left: "65%",
              bottom: 0,
              animationDuration: "20s",
              animationDelay: "7s",
            }}
          />
          <div
            className="particle"
            style={{
              width: 5,
              height: 5,
              left: "80%",
              bottom: 0,
              animationDuration: "16s",
              animationDelay: "2s",
            }}
          />
          <div
            className="particle"
            style={{
              width: 3,
              height: 3,
              left: "50%",
              bottom: 0,
              animationDuration: "12s",
              animationDelay: "5s",
            }}
          />
        </div>

        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Agente de retención inteligente
            </span>
            <h1 className="hero-h1">
              Cuando se van,
              <br />
              las señales
              <br />
              <em>siempre estuvieron ahí.</em>
            </h1>
            <p className="hero-sub">
              Los clientes no cancelan de un día para otro. Se desconectan en
              silencio, poco a poco. Canopy lee esas señales antes de que sea
              tarde.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn-primary">
                Empezar a retener
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => scrollToId("how")}
              >
                Ver cómo funciona →
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="plant-container">
              <div className="signal-dot">
                <div className="signal-ring" />
              </div>
              <div className="signal-dot">
                <div className="signal-ring" />
              </div>
              <div className="signal-dot">
                <div className="signal-ring" />
              </div>
              <div className="signal-dot">
                <div className="signal-ring" />
              </div>

              <svg
                className="plant-svg"
                viewBox="0 0 380 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", height: "100%" }}
                aria-hidden
              >
                <ellipse
                  cx="190"
                  cy="390"
                  rx="110"
                  ry="18"
                  fill="#6B4C2A"
                  opacity="0.2"
                />
                <ellipse
                  cx="190"
                  cy="388"
                  rx="80"
                  ry="12"
                  fill="#6B4C2A"
                  opacity="0.15"
                />
                <path
                  className="stem"
                  d="M190 388 C190 350 185 300 188 240 C191 180 185 140 190 80"
                  stroke="#6B4C2A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <g
                  className="leaf-group"
                  style={{ transformOrigin: "185px 280px" }}
                >
                  <path
                    d="M185 280 C160 260 130 245 115 225 C140 228 165 245 185 280Z"
                    fill="#3D5A3E"
                  />
                  <path
                    d="M185 280 C160 265 150 250 115 225"
                    stroke="#7FAF5F"
                    strokeWidth="1"
                    opacity="0.6"
                    fill="none"
                  />
                </g>
                <g
                  className="leaf-group"
                  style={{ transformOrigin: "190px 265px" }}
                >
                  <path
                    d="M190 265 C215 245 248 238 268 218 C242 224 218 242 190 265Z"
                    fill="#3D5A3E"
                  />
                  <path
                    d="M190 265 C215 248 245 235 268 218"
                    stroke="#7FAF5F"
                    strokeWidth="1"
                    opacity="0.6"
                    fill="none"
                  />
                </g>
                <g
                  className="leaf-group"
                  style={{ transformOrigin: "186px 185px" }}
                >
                  <path
                    d="M186 185 C155 165 125 152 105 132 C132 138 160 158 186 185Z"
                    fill="#5C7D5E"
                  />
                  <path
                    d="M186 185 C158 168 130 152 105 132"
                    stroke="#A8C97F"
                    strokeWidth="1"
                    opacity="0.6"
                    fill="none"
                  />
                </g>
                <g
                  className="leaf-group"
                  style={{ transformOrigin: "191px 140px" }}
                >
                  <path
                    d="M191 140 C220 118 255 110 278 92 C250 101 222 120 191 140Z"
                    fill="#5C7D5E"
                  />
                  <path
                    d="M191 140 C218 122 250 108 278 92"
                    stroke="#A8C97F"
                    strokeWidth="1"
                    opacity="0.6"
                    fill="none"
                  />
                </g>
                <g
                  className="leaf-group"
                  style={{ transformOrigin: "190px 82px" }}
                >
                  <path
                    d="M190 82 C178 65 170 52 172 38 C180 50 184 64 190 82Z"
                    fill="#7FAF5F"
                  />
                  <path
                    d="M190 82 C202 65 210 52 208 38 C200 50 196 64 190 82Z"
                    fill="#7FAF5F"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section id="problem">
        <div className="problem-inner">
          <div>
            <span className="problem-label reveal">La raíz del problema</span>
            <h2 className="problem-h2 reveal reveal-delay-1">
              Tu cliente no está enojado.
              <br />
              <em>Está cansado.</em>
            </h2>
            <p className="problem-body reveal reveal-delay-2">
              Cansado de explicar. De no ser reconocido. De sentir que es un
              número en una cartera, no una relación que alguien cuida.
            </p>
            <p
              className="problem-body reveal reveal-delay-3"
              style={{ marginTop: 20 }}
            >
              Tu equipo tampoco puede más: 40 cuentas, tres herramientas que no
              se hablan, y el cliente que más necesita atención no es el que
              grita. Es el que lleva semanas en silencio.
            </p>
          </div>
          <div className="chat-thread">
            <div className="bubble bubble-client reveal reveal-delay-1">
              <div className="bubble-meta">
                <span className="bubble-meta-dot" /> Cliente B2B · hace 3
                semanas
              </div>
              “Cansado de explicar el mismo problema en cada ticket. De recibir
              respuestas que no reconocen mi contexto. Siento que somos un
              número más en su cartera...”
            </div>
            <div className="bubble bubble-cs reveal reveal-delay-2">
              <div
                className="bubble-meta"
                style={{ flexDirection: "row-reverse" }}
              >
                <span className="bubble-meta-dot" /> Customer Success
              </div>
              “40 cuentas por persona, tres herramientas que no se hablan. El
              cliente que más necesitaba atención llevaba 3 semanas en silencio
              y nadie lo notó.”
            </div>
            <div className="problem-conclusion reveal reveal-delay-3">
              <p>
                El churn no empieza cuando cancela.
                <br />
                Empieza el día que siente que <em>nadie está mirando.</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="metaphor">
        <div className="metaphor-inner">
          <div className="metaphor-header reveal">
            <h2 className="metaphor-h2">
              Una planta no te avisa.
              <br />
              <em>Te lo muestra.</em>
            </h2>
            <p className="metaphor-sub">
              En el color de las hojas, en la tierra seca. Si sabes leer esas
              señales, puedes actuar antes de que sea tarde.
            </p>
          </div>
          <div className="metaphor-panels">
            <div className="panel reveal reveal-delay-1">
              <div className="panel-accent" />
              <svg
                className="panel-icon"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M24 40 C24 26 14 20 8 12 C16 12 21 17 24 24 C27 17 32 12 40 12 C34 20 24 26 24 40Z" />
              </svg>
              <span className="panel-signal">señal de vida</span>
              <h3 className="panel-h3">Deja de abrir el producto</h3>
              <p className="panel-body">
                Como una hoja que se inclina lejos de la luz. La frecuencia de
                uso es el primer indicador que nadie está mirando.
              </p>
            </div>
            <div className="panel reveal reveal-delay-2">
              <div className="panel-accent" />
              <svg
                className="panel-icon"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M24 8 L24 28" />
                <path d="M14 18 C14 18 10 24 10 30 C10 36 16 40 24 40 C32 40 38 36 38 30 C38 24 34 18 34 18" />
                <path d="M18 24 C20 28 24 30 24 30 C24 30 28 28 30 24" />
              </svg>
              <span className="panel-signal">señal de estrés</span>
              <h3 className="panel-h3">Sube más tickets de lo habitual</h3>
              <p className="panel-body">
                La raíz pide agua a gritos. El volumen y el tono de los tickets
                revelan lo que las métricas no capturan.
              </p>
            </div>
            <div className="panel reveal reveal-delay-3">
              <div className="panel-accent" />
              <svg
                className="panel-icon"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M24 12 C24 12 16 18 16 28 C16 34 20 38 24 38" />
                <path d="M24 12 C24 12 32 18 32 28 C32 34 28 38 24 38" />
                <circle cx="24" cy="28" r="2" fill="currentColor" />
              </svg>
              <span className="panel-signal">señal de silencio</span>
              <h3 className="panel-h3">El campeón deja de responder</h3>
              <p className="panel-body">
                10 días sin respuesta donde antes tardaba horas. El silencio de
                quien antes siempre estaba es la señal más elocuente de todas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="how-inner">
          <span className="how-label reveal">Cómo funciona</span>
          <h2 className="how-h2 reveal reveal-delay-1">
            Ve lo que nadie más ve.
            <br />
            <em>Entiende. Actúa.</em>
          </h2>
          <div className="steps">
            <div className="step reveal">
              <span className="step-number">01</span>
              <div className="step-content">
                <h3 className="step-h3">
                  Detecta <em>antes</em> de la crisis
                </h3>
                <p className="step-body">
                  Canopy observa cada cuenta en silencio: frecuencia de uso,
                  tono de los tickets, proximidad del contrato, el silencio de
                  quien antes siempre respondía. Lo detecta cuando todavía es
                  una señal, no una emergencia.
                </p>
              </div>
            </div>
            <div className="step reveal reveal-delay-1">
              <span className="step-number">02</span>
              <div className="step-content">
                <h3 className="step-h3">
                  Entiende lo que <em>está sintiendo</em>
                </h3>
                <p className="step-body">
                  No es lo mismo un cliente frustrado que uno desconectado. No
                  es lo mismo uno que no ve el valor que uno evaluando a la
                  competencia. La respuesta correcta depende de entender qué
                  pasa de verdad, no solo qué dicen los números.
                </p>
              </div>
            </div>
            <div className="step reveal reveal-delay-2">
              <span className="step-number">03</span>
              <div className="step-content">
                <h3 className="step-h3">
                  Le da al rep <em>exactamente</em> lo que necesita
                </h3>
                <p className="step-body">
                  No una alerta más. El mensaje correcto, para el contacto
                  correcto, en el tono correcto, listo para enviar. El rep
                  decide. Canopy prepara.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="metrics">
        <div className="metrics-bg-text">$</div>
        <div className="metrics-inner">
          <div className="metrics-header">
            <span className="metrics-label reveal">
              El argumento para el CFO
            </span>
            <h2 className="metrics-h2 reveal reveal-delay-1">
              Tres números que
              <br />
              justifican la conversación
            </h2>
          </div>
          <div className="metrics-grid">
            <div className="metric-card reveal reveal-delay-1">
              <span className="metric-num">8</span>
              <span className="metric-label">El costo del silencio</span>
              <p className="metric-desc">
                En una cartera de 50 clientes enterprise, en promedio 8 entran
                en riesgo de churn cada mes sin que nadie lo detecte a tiempo.
              </p>
            </div>
            <div className="metric-card reveal reveal-delay-2">
              <span className="metric-num">
                $400<span className="metric-unit">k</span>
              </span>
              <span className="metric-label">El impacto de actuar antes</span>
              <p className="metric-desc">
                Recuperar el 40% de esas cuentas representa hasta 400 mil
                dólares anuales en MRR retenido, sin adquirir un solo cliente
                nuevo.
              </p>
            </div>
            <div className="metric-card reveal reveal-delay-3">
              <span className="metric-num">
                +5<span className="metric-unit">h</span>
              </span>
              <span className="metric-label">El tiempo que se devuelve</span>
              <p className="metric-desc">
                Un CS rep invierte entre 3 y 5 horas semanales en detectar y
                hacer seguimiento manual. Canopy devuelve ese tiempo para usarlo
                donde hay valor real.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="close">
        <div className="close-bg-circle" />
        <div className="close-bg-circle" />
        <div className="close-bg-circle" />
        <div className="close-bg-circle" />

        <div className="close-inner">
          <svg
            className="close-plant-icon reveal"
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

          <h2 className="close-h2 reveal reveal-delay-1">
            El churn no empieza
            <br />
            cuando cancela.
            <br />
            <em>
              Empieza el día que siente
              <br />
              que nadie está mirando.
            </em>
          </h2>

          <p className="close-body reveal reveal-delay-2">
            Cada cuenta que se va en silencio es MRR que no se renovó y una
            relación que pudo haberse salvado. Canopy existe para que eso no
            ocurra.
          </p>

          <p className="close-body-2 reveal reveal-delay-3">
            Las plantas más saludables no son las que nunca pasan por momentos
            difíciles. Son las que tienen a alguien que sabe leer sus señales a
            tiempo.
          </p>

          <div className="close-pills reveal reveal-delay-3">
            <span className="pill">Detecta</span>
            <span className="pill-sep">·</span>
            <span className="pill">Entiende</span>
            <span className="pill-sep">·</span>
            <span className="pill">Actúa</span>
            <span className="pill-sep">·</span>
            <span className="pill">Retiene</span>
          </div>

          <button type="button" className="close-cta reveal reveal-delay-4">
            Empieza a escuchar las señales
          </button>
        </div>
      </section>

      <footer>
        © 2026 <span>Canopy Platform</span> · Todos los derechos reservados.
      </footer>
    </div>
  );
}
