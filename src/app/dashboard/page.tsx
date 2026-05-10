import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ESTADO_SALUD_LABEL } from "@/lib/labels/cliente";
import type { EstadoSalud } from "@prisma/client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.usuario.findUnique({
    where: { id: user.id },
    include: { empresa: true },
  });

  if (!dbUser) return null;

  const clientes = await prisma.cliente.findMany({
    where: { empresa_id: dbUser.empresa_id },
    include: {
      alertas: {
        where: { estado: "PENDIENTE" },
      },
      health_scores: {
        orderBy: { fecha_registro: "desc" },
        take: 1,
      },
    },
  });

  const mrrTotal = clientes.reduce((sum, c) => sum + Number(c.mrr), 0);

  const clientesEnRiesgo = clientes.filter((c) => c.alertas.some((a) => a.linea_deteccion === "LINEA_2"));

  const mrrEnRiesgo = clientesEnRiesgo.reduce((sum, c) => sum + Number(c.mrr), 0);

  const alertasPendientes = clientes.flatMap((c) => c.alertas).length;

  const pctRiesgo = mrrTotal > 0 ? (mrrEnRiesgo / mrrTotal) * 100 : 0;

  const latestByCliente = new Map<string, { score: number; estado_salud: EstadoSalud }>();
  for (const c of clientes) {
    const hs = c.health_scores[0];
    if (hs) latestByCliente.set(c.id, { score: hs.score, estado_salud: hs.estado_salud });
  }

  const distribucion: Record<EstadoSalud, number> = {
    VERDE: 0,
    AMARILLO: 0,
    ROJO: 0,
    CRITICO: 0,
  };
  for (const c of clientes) {
    const row = latestByCliente.get(c.id);
    if (row) distribucion[row.estado_salud] += 1;
  }

  const topUrgentes = [...clientes]
    .sort((a, b) => {
      const la = a.alertas.some((x) => x.linea_deteccion === "LINEA_2") ? 0 : 1;
      const lb = b.alertas.some((x) => x.linea_deteccion === "LINEA_2") ? 0 : 1;
      if (la !== lb) return la - lb;
      const sa = latestByCliente.get(a.id)?.score ?? 100;
      const sb = latestByCliente.get(b.id)?.score ?? 100;
      return sa - sb;
    })
    .slice(0, 5);

  const horasEstimadas = Math.min(40, Math.round(alertasPendientes * 0.75 + clientesEnRiesgo.length * 2));

  const bars = Object.entries(distribucion).filter(([, n]) => n > 0) as [EstadoSalud, number][];
  const maxBar = Math.max(1, ...Object.values(distribucion));

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-12 font-sans pb-4">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-ink text-cream px-8 py-10 shadow-card">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-moss/25 blur-3xl" aria-hidden />
        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-leaf/15 blur-3xl" aria-hidden />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-leaf-lt/90">Vista gerencial</p>
          <h2 className="mt-2 font-display text-4xl md:text-[2.75rem] font-medium tracking-tight text-cream">
            Hola, {dbUser.nombre.split(" ")[0]}
          </h2>
          <p className="mt-3 max-w-lg text-cream/70 text-base leading-relaxed">
            Resumen de {dbUser.empresa.nombre}: cartera, alertas abiertas y foco en lo que no puede esperar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard/alertas"
              className="inline-flex items-center justify-center rounded-full bg-moss px-6 py-2.5 text-sm font-medium text-white-warm shadow-btn-primary hover:bg-moss-lt transition-all"
            >
              Ver alertas
            </Link>
            <Link
              href="/dashboard/clientes"
              className="inline-flex items-center justify-center rounded-full border border-cream/25 px-6 py-2.5 text-sm font-medium text-cream hover:bg-cream/10 transition-colors"
            >
              Lista de clientes
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="group relative rounded-2xl border border-ink-20 bg-white-warm p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full bg-rust" aria-hidden />
          <p className="pl-4 text-xs font-medium uppercase tracking-wider text-ink-60">MRR en riesgo (L2)</p>
          <p className="pl-4 mt-3 font-display text-5xl font-medium text-rust tabular-nums">
            ${mrrEnRiesgo.toLocaleString()}
          </p>
          <p className="pl-4 mt-2 text-sm text-ink-60">
            {mrrTotal > 0 ? `${pctRiesgo.toFixed(1)}% del total` : "—"} · Cartera ${mrrTotal.toLocaleString()}
          </p>
        </div>

        <div className="group relative rounded-2xl border border-ink-20 bg-white-warm p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full bg-moss" aria-hidden />
          <p className="pl-4 text-xs font-medium uppercase tracking-wider text-ink-60">Alertas pendientes</p>
          <p className="pl-4 mt-3 font-display text-5xl font-medium text-ink tabular-nums">{alertasPendientes}</p>
          <p className="pl-4 mt-2 text-sm text-ink-60">Incluyen Línea 1 y Línea 2 sin cerrar.</p>
        </div>

        <div className="group relative rounded-2xl border border-ink-20 bg-white-warm p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full bg-leaf" aria-hidden />
          <p className="pl-4 text-xs font-medium uppercase tracking-wider text-ink-60">Horas ahorradas (estim.)</p>
          <p className="pl-4 mt-3 font-display text-5xl font-medium text-moss tabular-nums">{horasEstimadas}h</p>
          <p className="pl-4 mt-2 text-sm text-ink-60">Demo: derivado de alertas y cuentas L2.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <section className="lg:col-span-3 bg-white-warm rounded-2xl border border-ink-20 shadow-card p-6 md:p-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display text-2xl text-ink font-medium">Prioridad hoy</h3>
              <p className="text-sm text-ink-60 mt-1">Orden: L2 primero, luego health score más bajo.</p>
            </div>
            <Link href="/dashboard/clientes" className="text-sm font-medium text-moss hover:text-moss-lt whitespace-nowrap">
              Ver todos
            </Link>
          </div>
          <ul className="divide-y divide-ink-20">
            {topUrgentes.map((c) => {
              const l2 = c.alertas.some((a) => a.linea_deteccion === "LINEA_2");
              const hs = latestByCliente.get(c.id);
              return (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0">
                  <div>
                    <Link
                      href={`/dashboard/clientes/${c.id}`}
                      className="font-medium text-ink hover:text-moss transition-colors font-display text-lg"
                    >
                      {c.nombre}
                    </Link>
                    <p className="text-xs text-ink-60 mt-0.5">
                      MRR ${Number(c.mrr).toLocaleString()}
                      {hs && (
                        <>
                          {" "}
                          · Score {hs.score}{" "}
                          <span className="text-ink-60">({ESTADO_SALUD_LABEL[hs.estado_salud].split(" —")[0]})</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {l2 ? (
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-risk-accent text-white-warm">
                        Línea 2
                      </span>
                    ) : c.alertas.length > 0 ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-rust/12 text-rust border border-rust/20">
                        Línea 1
                      </span>
                    ) : (
                      <span className="text-[10px] text-ink-60 uppercase tracking-wide">Sin alerta</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="lg:col-span-2 bg-cream rounded-2xl border border-ink-20 p-6 md:p-8">
          <h3 className="font-display text-xl text-ink font-medium mb-2">Salud de la cartera</h3>
          <p className="text-sm text-ink-60 mb-6">Último health score registrado por cuenta.</p>
          {clientes.length === 0 ? (
            <p className="text-sm text-ink-60">Sin clientes aún.</p>
          ) : bars.length === 0 ? (
            <p className="text-sm text-ink-60">Sin datos de health suficientes.</p>
          ) : (
            <ul className="space-y-4">
              {bars.map(([estado, count]) => (
                <li key={estado}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-ink font-medium">{ESTADO_SALUD_LABEL[estado].split(" —")[0]}</span>
                    <span className="text-ink-60 tabular-nums">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white-warm border border-ink-20 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        estado === "VERDE"
                          ? "bg-leaf"
                          : estado === "AMARILLO"
                            ? "bg-moss"
                            : estado === "ROJO"
                              ? "bg-rust"
                              : "bg-risk-accent"
                      }`}
                      style={{ width: `${(count / maxBar) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
