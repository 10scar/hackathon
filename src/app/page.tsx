import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen text-text-main font-sans selection:bg-surface selection:text-primary overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="Canopy Logo" fill className="object-contain" />
            </div>
            <span className="font-montserrat font-bold text-2xl text-secondary tracking-tight">Canopy</span>
          </div>
          <button className="bg-primary text-white font-montserrat font-semibold px-6 py-2.5 rounded-md hover:bg-[#1E8449] transition-all shadow-[0px_4px_12px_rgba(39,174,96,0.3)]">
            Acceder
          </button>
        </div>
      </nav>

      {/* SECCIÓN 1: Hero */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-surface rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface text-primary text-sm font-medium mb-8 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Agente de Retención Inteligente
            </div>
            <h1 className="font-montserrat font-bold text-5xl lg:text-6xl text-secondary leading-[1.15] mb-6">
              Cuando finalmente se van,<br />las señales siempre<br />
              <span className="text-primary">estuvieron ahí.</span>
            </h1>
            <p className="text-xl text-text-muted leading-relaxed mb-10 max-w-lg">
              Los clientes no cancelan de un día para otro. Se desconectan poco a poco en silencio. Canopy detecta esas sutiles caídas de engagement antes de que sea tarde.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button className="bg-primary text-white font-montserrat font-semibold px-8 py-4 rounded-md hover:bg-[#1E8449] transition-all shadow-lg shadow-primary/30 text-lg w-full sm:w-auto">
                Empezar a Retener
              </button>
              <button className="px-8 py-4 rounded-md font-montserrat font-semibold text-secondary border border-border hover:bg-surface transition-all w-full sm:w-auto">
                Ver Demo
              </button>
            </div>
          </div>
          
          {/* HERO ICON / SVG */}
          <div className="relative h-[400px] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl border border-border flex items-center justify-center bg-gradient-to-br from-surface to-white/50 backdrop-blur-sm">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
              <svg className="w-full h-full text-primary relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c0-9 5-13 5-13s-3.5 1.5-5 5c-1.5-3.5-5-5-5-5s5 4 5 13z"></path>
                <path d="M12 14c-4-4-8-2-8-2s2 4 8 2z"></path>
                <path d="M12 14c4-4 8-2 8-2s-2 4-8 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: El problema */}
      <section className="py-24 bg-surface px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-montserrat font-bold text-4xl text-secondary mb-16">
            Tu cliente no está enojado.<br />Está cansado.
          </h2>
          
          <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            {/* Mensaje 1 */}
            <div className="bg-white p-6 rounded-2xl rounded-tl-sm shadow-sm border border-border text-left transform transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs">C</div>
                <span className="font-medium text-text-main text-sm">Cliente B2B</span>
                <span className="text-xs text-text-muted ml-auto">Hace 3 semanas</span>
              </div>
              <p className="text-text-muted">
                "Cansado de explicar el mismo problema en cada ticket. Cansado de recibir respuestas genéricas que no reconocen mi contexto. Siento que somos un número más en su cartera..."
              </p>
            </div>
            
            {/* Mensaje 2 */}
            <div className="bg-primary/10 p-6 rounded-2xl rounded-tr-sm shadow-sm border border-primary/20 text-left self-end max-w-[90%] transform transition-all hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">CS</div>
                <span className="font-medium text-text-main text-sm">Equipo de Éxito del Cliente</span>
              </div>
              <p className="text-secondary">
                "Tenemos 40 cuentas por persona y tres herramientas distintas que no se hablan. El cliente que más atención necesitaba llevaba 3 semanas en silencio y nadie lo notó."
              </p>
            </div>
            
            {/* Conclusión del Problema */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-l-error border-y-border border-r-border text-center mt-8">
              <p className="font-montserrat text-xl font-bold text-text-main">
                El churn no empieza cuando el cliente cancela.<br />
                <span className="text-error mt-2 block">Empieza el día que siente que nadie está mirando.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: La metáfora */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* ICONO METÁFORA */}
          <div className="relative h-[400px] flex items-center justify-center rounded-2xl bg-surface border border-border order-2 lg:order-1">
             <div className="relative w-48 h-48">
              <svg className="w-full h-full text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="font-montserrat font-bold text-4xl text-secondary mb-8">
              Una planta no te avisa que se está muriendo. Te lo muestra.
            </h2>
            <p className="text-lg text-text-muted leading-relaxed mb-6">
              En el color de las hojas, en la tierra seca, en cómo se inclina hacia la luz. Si sabes leer esas señales, puedes actuar antes de que sea tarde.
            </p>
            <p className="text-lg text-text-muted leading-relaxed mb-8">
              Tus clientes hacen lo mismo. Dejan de abrir el producto. Suben más tickets de lo habitual. El campeón que siempre respondía tarda ahora diez días en contestar.
            </p>
            <p className="font-montserrat text-2xl font-semibold text-primary border-l-4 border-primary pl-6 py-2">
              Las señales están ahí. Canopy las lee por ti.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: Cómo funciona */}
      <section className="py-24 bg-secondary text-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-montserrat font-bold text-4xl mb-6">Ve lo que nadie más ve.</h2>
            <p className="text-surface/80 text-lg">
              Canopy observa cada cuenta en silencio: frecuencia de uso, tono de los tickets, proximidad del contrato, el silencio de alguien que antes siempre respondía.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 text-2xl">👁️</div>
              <h3 className="font-montserrat font-semibold text-xl mb-4">Detecta antes de la crisis</h3>
              <p className="text-surface/70 leading-relaxed">
                Lo detecta cuando todavía es una señal, no una crisis. Analiza los comportamientos sutiles para identificar riesgo.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 text-2xl">🧠</div>
              <h3 className="font-montserrat font-semibold text-xl mb-4">Entiende lo que está sintiendo</h3>
              <p className="text-surface/70 leading-relaxed">
                No es lo mismo un cliente frustrado que uno desconectado o evaluando a la competencia. Entiende qué pasa de verdad.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full blur-2xl"></div>
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 text-2xl">⚡</div>
              <h3 className="font-montserrat font-semibold text-xl mb-4">Le da al rep lo que necesita</h3>
              <p className="text-surface/70 leading-relaxed relative z-10">
                El mensaje correcto, para el contacto correcto, en el tono correcto, listo para enviar. El rep decide. Canopy prepara.
              </p>
            </div>
          </div>

          {/* WIREFRAME DASHBOARD (BLANCO/VACÍO) */}
          <div className="relative h-[600px] w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/20 mt-12 bg-[#0F172A] p-8 flex flex-col">
            <div className="w-full flex items-center justify-between mb-8 pb-6 border-b border-white/10">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/80 rounded-full"></div>
                <div className="w-48 h-10 bg-white/10 rounded-md"></div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                 <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-8">
              <div className="col-span-2 bg-white/5 rounded-xl border border-white/10 p-8 flex flex-col gap-6">
                <div className="w-40 h-6 bg-white/20 rounded"></div>
                <div className="w-24 h-12 bg-primary/40 rounded"></div>
                <div className="flex-1 bg-white/5 rounded-lg border border-white/5"></div>
              </div>
              <div className="col-span-1 flex flex-col gap-8">
                <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-8 flex flex-col gap-4">
                  <div className="w-32 h-6 bg-white/20 rounded"></div>
                  <div className="flex-1 bg-white/5 rounded-lg border border-white/5"></div>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-8 flex flex-col gap-4">
                   <div className="w-32 h-6 bg-white/20 rounded"></div>
                   <div className="w-full h-10 bg-white/10 rounded"></div>
                   <div className="w-full h-10 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN 5: Métricas */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Número 1 — El costo del silencio</h3>
              <p className="font-montserrat font-bold text-5xl text-primary mb-4">8</p>
              <p className="text-text-muted">
                En una cartera de 50 clientes enterprise, en promedio 8 entran en riesgo de churn cada mes sin que nadie lo detecte a tiempo.
              </p>
            </div>

            <div className="p-8 border border-border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-surface rounded-bl-full -z-10"></div>
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Número 2 — El impacto</h3>
              <p className="font-montserrat font-bold text-5xl text-secondary mb-4">$400k</p>
              <p className="text-text-muted">
                Recuperar el 40% de esas cuentas representa hasta 400 mil dólares anuales en MRR retenido, sin adquirir un solo cliente nuevo.
              </p>
            </div>

            <div className="p-8 border border-border rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Número 3 — El tiempo</h3>
              <p className="font-montserrat font-bold text-5xl text-primary mb-4">+5h</p>
              <p className="text-text-muted">
                Un CS rep invierte horas semanales en seguimiento manual. Canopy devuelve ese tiempo para usarlo donde hay valor real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 6: Cierre */}
      <section className="py-32 px-6 bg-surface text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-8 relative">
            <Image src="/logo.png" alt="Canopy" fill className="object-contain" />
          </div>
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl text-secondary leading-tight mb-8">
            El churn no empieza cuando el cliente cancela.
            <span className="block text-primary mt-2">Empieza el día que siente que nadie está mirando.</span>
          </h2>
          
          <p className="text-xl text-text-muted leading-relaxed mb-12 max-w-3xl mx-auto">
            Cada cuenta que se va en silencio es MRR que no se renovó y una relación que pudo haberse salvado. 
            Las plantas más saludables no son las que nunca pasan por momentos difíciles. 
            Son las que tienen a alguien que sabe leer sus señales a tiempo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-montserrat font-semibold text-lg text-secondary">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span>Detecta.</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span>Entiende.</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span>Actúa.</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span>Retiene.</span>
          </div>

          <button className="mt-16 bg-primary text-white font-montserrat font-semibold px-8 py-4 rounded-md hover:bg-[#1E8449] transition-all shadow-lg text-lg">
            Empieza a escuchar las señales
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-white border-t border-border text-center text-text-muted text-sm">
        <p>© 2026 Canopy Platform. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
