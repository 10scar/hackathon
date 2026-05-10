import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { USUARIO_ROL_LABEL } from "@/lib/labels/usuario-rol";
import type { LineaDeteccion } from "@prisma/client";

function lineaTag(linea: LineaDeteccion) {
  if (linea === "LINEA_2") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-risk-accent text-white-warm uppercase tracking-wide">
        L2
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rust/15 text-rust uppercase tracking-wide">
      L1
    </span>
  );
}

export default async function AlertasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await prisma.usuario.findUnique({ where: { id: user.id } });
  if (!dbUser) return null;

  const alertas = await prisma.alertaIntervencion.findMany({
    where: {
      estado: "PENDIENTE",
      cliente: { empresa_id: dbUser.empresa_id },
    },
    include: {
      cliente: true,
      usuario: true,
    },
    orderBy: [{ linea_deteccion: "desc" }, { sla_vencimiento: "asc" }],
  });

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 font-sans">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-moss">Operativa</p>
        <h2 className="font-display font-medium text-4xl text-ink tracking-tight">Alertas activas</h2>
        <p className="text-ink-60 max-w-xl">
          {alertas.length === 0
            ? "No hay alertas pendientes. Ejecuta el análisis o revisa la bandeja más tarde."
            : "Prioriza Línea 2 y revisa el SLA antes de que venza."}
        </p>
      </header>

      {alertas.length === 0 ? (
        <div className="bg-white-warm rounded-2xl border border-dashed border-ink-20 p-12 text-center">
          <p className="text-ink-60">Sin alertas pendientes.</p>
          <Link href="/dashboard/clientes" className="inline-block mt-4 text-moss font-medium hover:underline">
            Ver clientes
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {alertas.map((a) => (
            <li
              key={a.id}
              className={`rounded-2xl border shadow-card p-5 md:p-6 transition-shadow hover:shadow-card-hover bg-white-warm ${
                a.linea_deteccion === "LINEA_2"
                  ? "border-risk-accent/40 ring-1 ring-risk-accent/15"
                  : "border-ink-20"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {lineaTag(a.linea_deteccion)}
                    <Link
                      href={`/dashboard/clientes/${a.cliente_id}`}
                      className="font-display text-xl text-ink font-medium hover:text-moss transition-colors"
                    >
                      {a.cliente.nombre}
                    </Link>
                  </div>
                  <p className="text-sm text-ink leading-relaxed max-w-3xl">{a.mensaje_generado}</p>
                  <p className="text-xs text-ink-60 mt-3">
                    {a.usuario ? (
                      <>
                        Asignado: <span className="text-ink font-medium">{a.usuario.nombre}</span> (
                        {USUARIO_ROL_LABEL[a.usuario.rol]})
                      </>
                    ) : (
                      "Sin asignar"
                    )}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] uppercase tracking-wider text-ink-60 font-medium">SLA hasta</p>
                  <time className="text-sm font-medium text-ink block" dateTime={a.sla_vencimiento.toISOString()}>
                    {new Intl.DateTimeFormat("es", { dateStyle: "short", timeStyle: "short" }).format(
                      a.sla_vencimiento
                    )}
                  </time>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
