import { prisma } from "@/lib/prisma";
import { clasificarCliente } from "./classifier";
import type { ResultadoClasificacion } from "./types";

export interface ResumenAnalisis {
  empresa_id: string;
  ejecutadoEn: Date;
  totalClientes: number;
  totalLinea1: number;
  totalLinea2: number;
  totalSinAlerta: number;
  resultados: ResultadoClasificacion[];
}

export async function ejecutarAnalisisParaEmpresa(
  empresa_id: string
): Promise<ResumenAnalisis> {
  const clientes = await prisma.cliente.findMany({
    where: { empresa_id },
    include: {
      empresa: { select: { tier: true } },
      contactos: true,
      senales: true,
      health_scores: { orderBy: { fecha_registro: "desc" }, take: 30 },
    },
  });

  const resultados: ResultadoClasificacion[] = [];
  for (const cliente of clientes) {
    const r = await clasificarCliente(cliente);
    resultados.push(r);
  }

  return {
    empresa_id,
    ejecutadoEn: new Date(),
    totalClientes: clientes.length,
    totalLinea1: resultados.filter(r => r.lineaFinal === "LINEA_1").length,
    totalLinea2: resultados.filter(r => r.lineaFinal === "LINEA_2").length,
    totalSinAlerta: resultados.filter(r => r.lineaFinal === null).length,
    resultados,
  };
}

export { clasificarCliente } from "./classifier";
export { detectarLinea1 } from "./line-1";
export { detectarLinea2 } from "./line-2";
export { calcularEHistorizarHealthScore } from "./health-score";
export type * from "./types";