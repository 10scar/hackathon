import { prisma } from "@/lib/prisma";
import { CRITERIO_LINEA_2 } from "./weights";
import type { ResultadoLinea2 } from "./types";

function fechaMenosDias(dias: number): Date {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
}

function descripcionContiene(texto: string, keywords: readonly string[]): boolean {
  const lower = texto.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

export async function detectarLinea2(cliente_id: string): Promise<ResultadoLinea2> {
  const [contactos, senales] = await Promise.all([
    prisma.contacto.findMany({ where: { cliente_id } }),
    prisma.senal.findMany({
      where: { cliente_id },
      orderBy: { fecha_creacion: "desc" },
    }),
  ]);

  const triggers: string[] = [];

  const senalCancelacion = senales.find(s =>
    descripcionContiene(s.descripcion, CRITERIO_LINEA_2.keywordsCancelacion)
  );
  if (senalCancelacion) {
    triggers.push(`Mención de cancelación/competencia: "${senalCancelacion.descripcion}"`);
  }

  const campeonComprometido = contactos.find(c =>
    c.rol_cuenta === "CAMPEON" &&
    (c.estado_actual === "CAMBIO_DE_EMPRESA" ||
     c.dias_sin_login > CRITERIO_LINEA_2.diasInactividadCampeon)
  );
  if (campeonComprometido) {
    const motivo = campeonComprometido.estado_actual === "CAMBIO_DE_EMPRESA"
      ? "cambió de empresa"
      : `inactivo ${campeonComprometido.dias_sin_login} días`;
    triggers.push(`Campeón ${campeonComprometido.nombre} ${motivo}`);
  }

  const cutoffCriticas = fechaMenosDias(CRITERIO_LINEA_2.ventanaSenalesCriticasDias);
  const senalesCriticasRecientes = senales.filter(
    s => s.es_critica && s.fecha_creacion >= cutoffCriticas
  );
  if (senalesCriticasRecientes.length >= CRITERIO_LINEA_2.senalesCriticasMinimas) {
    triggers.push(
      `${senalesCriticasRecientes.length} señales críticas en los últimos ` +
      `${CRITERIO_LINEA_2.ventanaSenalesCriticasDias} días`
    );
  }

  const cutoffPago = fechaMenosDias(CRITERIO_LINEA_2.ventanaFalloPagoDias);
  const falloPago = senales.find(s =>
    s.tipo === "FACTURACION" &&
    s.fecha_creacion >= cutoffPago &&
    descripcionContiene(s.descripcion, CRITERIO_LINEA_2.keywordsFalloPago)
  );
  if (falloPago) {
    triggers.push(`Fallo de pago reciente: "${falloPago.descripcion}"`);
  }

  return {
    detectado: triggers.length > 0,
    triggers,
  };
}