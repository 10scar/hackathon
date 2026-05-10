import { prisma } from "@/lib/prisma";
import { LineaDeteccion, EstadoAlerta, TipoOutput } from "@prisma/client";
import { calcularEHistorizarHealthScore } from "./health-score";
import { detectarLinea1 } from "./line-1";
import { detectarLinea2 } from "./line-2";
import { SLA_MINUTOS } from "./weights";
import type {
  ClienteConContexto,
  ResultadoClasificacion,
  ResultadoLinea1,  
} from "./types";

export async function clasificarCliente(
  cliente: ClienteConContexto
): Promise<ResultadoClasificacion> {
  const healthScore = await calcularEHistorizarHealthScore(cliente);

  const linea2 = await detectarLinea2(cliente.id);

  const linea1: ResultadoLinea1 = linea2.detectado
    ? { detectado: false, razones: [] }
    : await detectarLinea1(cliente.id);

  let lineaFinal: LineaDeteccion | null = null;
  let motivoFinal: string[] = [];
  if (linea2.detectado) {
    lineaFinal = "LINEA_2";
    motivoFinal = linea2.triggers;
  } else if (linea1.detectado) {
    lineaFinal = "LINEA_1";
    motivoFinal = linea1.razones;
  }

  if (lineaFinal) {
    await crearOActualizarAlerta(cliente.id, lineaFinal, motivoFinal);
  }

  return {
    cliente_id: cliente.id,
    cliente_nombre: cliente.nombre,
    healthScore,
    linea1,
    linea2,
    lineaFinal,
    motivoFinal,
  };
}

async function crearOActualizarAlerta(
  cliente_id: string,
  linea: LineaDeteccion,
  motivos: string[],
) {
  const existente = await prisma.alertaIntervencion.findFirst({
    where: { cliente_id, estado: EstadoAlerta.PENDIENTE },
    orderBy: { fecha_creacion: "desc" },
  });

  const slaVencimiento = new Date(
    Date.now() + SLA_MINUTOS[linea] * 60 * 1000
  );

  const notaInterna = `Detectado por motor de reglas:\n- ${motivos.join("\n- ")}`;

  if (existente) {
    await prisma.alertaIntervencion.update({
      where: { id: existente.id },
      data: {
        linea_deteccion: linea,
        nota_interna: notaInterna,
        sla_vencimiento: slaVencimiento,
      },
    });
    return;
  }

  await prisma.alertaIntervencion.create({
    data: {
      cliente_id,
      linea_deteccion: linea,
      emocion_detectada: "Pendiente de análisis IA",
      tipo_output: TipoOutput.B_ASINCRONO,
      mensaje_generado: "Pendiente de generar por Claude",
      nota_interna: notaInterna,
      estado: EstadoAlerta.PENDIENTE,
      sla_vencimiento: slaVencimiento,
    },
  });
}