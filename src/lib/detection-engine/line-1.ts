import { prisma } from "@/lib/prisma";
import { CRITERIO_LINEA_1 } from "./weights";
import type { ResultadoLinea1 } from "./types";
import type { EstadoSalud } from "@prisma/client";

const ESTADOS_ROJOS: EstadoSalud[] = ["ROJO", "CRITICO"];

function fechaMenosDias(dias: number): Date {
  return new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
}

export async function detectarLinea1(cliente_id: string): Promise<ResultadoLinea1> {
  const historial = await prisma.healthScore.findMany({
    where: { cliente_id },
    orderBy: { fecha_registro: "desc" },
    select: { score: true, estado_salud: true, fecha_registro: true },
  });

  if (historial.length === 0) {
    return { detectado: false, razones: [] };
  }

  const [actual, ...previos] = historial;
  const razones: string[] = [];

  const enVentana = historial.filter(
    h => h.fecha_registro >= fechaMenosDias(CRITERIO_LINEA_1.ventanaDias)
  );
  const maxEnVentana = Math.max(...enVentana.map(h => h.score));
  const caida = maxEnVentana - actual.score;
  const cayoMucho = caida > CRITERIO_LINEA_1.caidaScoreMinima;

  if (cayoMucho) {
    razones.push(
      `Caída de ${caida} puntos en los últimos ${CRITERIO_LINEA_1.ventanaDias} días ` +
      `(de ${maxEnVentana} a ${actual.score})`
    );
  }

  const actualEnRojo = ESTADOS_ROJOS.includes(actual.estado_salud);
  const algunPrevioEnRojo = previos.some(p => ESTADOS_ROJOS.includes(p.estado_salud));
  const primeraVezEnRojo = actualEnRojo && !algunPrevioEnRojo;

  if (primeraVezEnRojo) {
    razones.push(`Entró por primera vez en zona ${actual.estado_salud}`);
  }

  return {
    detectado: cayoMucho || primeraVezEnRojo,
    razones,
    caidaPuntos: caida,
    primeraVezEnRojo,
  };
}