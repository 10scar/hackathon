import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ESTADO_SALUD_LABEL, ETAPA_CICLO_LABEL } from "@/lib/labels/cliente";
import { USUARIO_ROL_LABEL } from "@/lib/labels/usuario-rol";
import type { LineaDeteccion } from "@prisma/client";

function scoreColor(score: number) {
  if (score <= 45) return "text-risk-accent";
  if (score <= 75) return "text-rust";
  return "text-leaf";
}

function scoreOnDark(score: number) {
  if (score <= 45) return "text-risk-accent";
  if (score <= 75) return "text-rust";
  return "text-leaf-lt";
}

function barColor(score: number) {
  if (score <= 45) return "bg-risk-accent";
  if (score <= 75) return "bg-rust";
  return "bg-leaf";
}

function lineaBadge(linea: LineaDeteccion) {
  if (linea === "LINEA_2")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-risk-accent text-white-warm">
        <span className="w-1.5 h-1.5 rounded-full bg-white-warm animate-pulse" />
        Línea 2
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rust/10 text-rust border border-rust/25">
      Línea 1
    </span>
  );
}

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  const dbUser = await prisma.usuario.findUnique({ where: { id: user.id } });
  if (!dbUser) return notFound();

  const cliente = await prisma.cliente.findFirst({
    where: { id, empresa_id: dbUser.empresa_id },
    include: {
      health_scores: { orderBy: { fecha_registro: "desc" } },
      contactos: { orderBy: { nombre: "asc" } },
      senales: { orderBy: { fecha_creacion: "desc" }, take: 12 },
      alertas: {
        where: { estado: "PENDIENTE" },
        include: { usuario: true },
        orderBy: { fecha_creacion: "desc" },
      },
    },
  });

  if (!cliente) notFound();

  const latest = cliente.health_scores[0];
  const previous = cliente.health_scores[1];
  const delta = latest && previous ? latest.score - previous.score : null;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 font-sans pb-8">
      <nav className="text-sm text-ink-60">
        <Link href="/dashboard/clientes" className="hover:text-moss transition-colors">
          Mis clientes
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-ink font-medium">{cliente.nombre}</span>
      </nav>

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-moss">Cuenta</p>
          <h1 className="font-display font-medium text-4xl text-ink tracking-tight">{cliente.nombre}</h1>
          <p className="text-ink-60">
            {ETAPA_CICLO_LABEL[cliente.etapa_ciclo]} · Renovación en{" "}
            <span className="text-ink font-medium">{cliente.dias_para_renovacion} días</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white-warm rounded-2xl border border-ink-20 px-6 py-4 shadow-card min-w-[140px]">
            <p className="text-xs uppercase tracking-wider text-ink-60 font-medium">MRR</p>
            <p className="font-display text-3xl text-ink mt-1">${Number(cliente.mrr).toLocaleString()}</p>
          </div>
          {latest && (
            <div className="bg-ink rounded-2xl px-6 py-4 text-cream min-w-[180px] shadow-card">
              <p className="text-xs uppercase tracking-wider text-cream/60 font-medium">Health score</p>
              <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                <span className={`font-display text-4xl ${scoreOnDark(latest.score)}`}>{latest.score}</span>
                {delta !== null && (
                  <span className={`text-sm font-medium ${delta < 0 ? "text-risk-accent" : "text-leaf-lt"}`}>
                    {delta > 0 ? `+${delta}` : delta} vs anterior
                  </span>
                )}
              </div>
              <p className="text-sm text-cream/70 mt-2">{ESTADO_SALUD_LABEL[latest.estado_salud]}</p>
            </div>
          )}
        </div>
      </header>

      {/* Historial health */}
      <section className="bg-white-warm rounded-2xl border border-ink-20 shadow-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl text-ink font-medium">Historial de salud</h2>
            <p className="text-sm text-ink-60 mt-1">Evolución registrada en Canopy (más reciente primero).</p>
          </div>
          {latest && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-60">Último registro</span>
              <time className="text-sm font-medium text-ink" dateTime={latest.fecha_registro.toISOString()}>
                {new Intl.DateTimeFormat("es", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(latest.fecha_registro)}
              </time>
            </div>
          )}
        </div>

        {cliente.health_scores.length === 0 ? (
          <p className="text-ink-60 text-sm">Aún no hay registros de health score.</p>
        ) : (
          <ol className="space-y-0">
            {cliente.health_scores.map((h, i) => (
              <li key={h.id} className="flex gap-4">
                <div className="flex flex-col items-center shrink-0 w-5 pt-1.5">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${barColor(h.score)} ring-4 ring-white-warm`} />
                  {i < cliente.health_scores.length - 1 && (
                    <span className="w-px flex-1 min-h-[1.75rem] bg-ink-20 my-1" aria-hidden />
                  )}
                </div>
                <div
                  className={`flex-1 ${i < cliente.health_scores.length - 1 ? "pb-8" : "pb-0"}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className={`text-2xl font-display font-medium ${scoreColor(h.score)}`}>{h.score}</span>
                    <span className="text-sm text-ink-60">
                      {new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(
                        h.fecha_registro
                      )}
                    </span>
                    <span className="text-sm text-ink font-medium">{ESTADO_SALUD_LABEL[h.estado_salud]}</span>
                  </div>
                  {h.factores_clave != null && (
                    <pre className="mt-2 text-xs text-ink-60 bg-cream rounded-lg p-3 overflow-x-auto border border-ink-20 font-sans">
                      {JSON.stringify(h.factores_clave, null, 2)}
                    </pre>
                  )}
                  {i === 0 && (
                    <div className="mt-3 h-2 rounded-full bg-sand overflow-hidden max-w-xs">
                      <div
                        className={`h-full rounded-full transition-all ${barColor(h.score)}`}
                        style={{ width: `${h.score}%` }}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Alertas */}
      {cliente.alertas.length > 0 && (
        <section className="bg-white-warm rounded-2xl border border-ink-20 shadow-card p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink font-medium mb-2">Alertas activas</h2>
          <ul className="space-y-4 mt-6">
            {cliente.alertas.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-ink-20 p-4 bg-cream/50 hover:bg-cream transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {lineaBadge(a.linea_deteccion)}
                  <span className="text-xs text-ink-60">
                    {a.usuario
                      ? `Asignado: ${a.usuario.nombre} (${USUARIO_ROL_LABEL[a.usuario.rol]})`
                      : "Sin asignar"}
                  </span>
                </div>
                <p className="text-sm text-ink leading-relaxed">{a.mensaje_generado}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white-warm rounded-2xl border border-ink-20 shadow-card p-6">
          <h3 className="font-display text-xl text-ink font-medium mb-4">Contactos</h3>
          {cliente.contactos.length === 0 ? (
            <p className="text-sm text-ink-60">Sin contactos registrados.</p>
          ) : (
            <ul className="space-y-3">
              {cliente.contactos.map((c) => (
                <li key={c.id} className="flex justify-between gap-4 text-sm border-b border-ink-20 last:border-0 pb-3 last:pb-0">
                  <span className="font-medium text-ink">{c.nombre}</span>
                  <span className="text-ink-60 text-right text-xs">{c.rol_cuenta.replace(/_/g, " ")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white-warm rounded-2xl border border-ink-20 shadow-card p-6">
          <h3 className="font-display text-xl text-ink font-medium mb-4">Señales recientes</h3>
          {cliente.senales.length === 0 ? (
            <p className="text-sm text-ink-60">Sin señales recientes.</p>
          ) : (
            <ul className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {cliente.senales.map((s) => (
                <li key={s.id} className="text-sm border-b border-ink-20 last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between gap-2 mb-1">
                    <span className="font-medium text-ink">{s.tipo}</span>
                    {s.es_critica && (
                      <span className="text-[10px] uppercase font-bold text-risk-accent">Crítica</span>
                    )}
                  </div>
                  <p className="text-ink-60 leading-snug">{s.descripcion}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
