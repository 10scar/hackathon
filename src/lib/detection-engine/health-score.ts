import { prisma } from "@/lib/prisma";
import { EstadoSalud } from "@prisma/client";
import {
  HEALTH_SCORE_BASE,
  PESOS,
  TIER_MULTIPLIER,
  UMBRALES_SCORE,
} from "./weights";
import type {
  ClienteConContexto,
  DesgloseScore,
  ResultadoHealthScore,
} from "./types";

function mapearEstadoSalud(score: number): EstadoSalud {
  for (const u of UMBRALES_SCORE) {
    if (score >= u.min) return u.estado;
  }
  return "CRITICO";
}

export function calcularDesgloseScore(
  cliente: ClienteConContexto
): DesgloseScore {
  const penalizaciones: DesgloseScore["penalizaciones"] = [];

  for (const c of cliente.contactos.filter(c => c.rol_cuenta === "CAMPEON")) {
    if (c.estado_actual === "CAMBIO_DE_EMPRESA") {
      penalizaciones.push({
        motivo: `Campeón ${c.nombre} cambió de empresa`,
        puntos: PESOS.campeonCambioEmpresa,
      });
    } else if (c.estado_actual === "NO_RESPONDE") {
      penalizaciones.push({
        motivo: `Campeón ${c.nombre} no responde`,
        puntos: PESOS.campeonNoResponde,
      });
    }
    if (c.dias_sin_login > 7) {
      penalizaciones.push({
        motivo: `Campeón ${c.nombre} sin login ${c.dias_sin_login} días`,
        puntos: PESOS.diasSinLoginCampeonPorDia * c.dias_sin_login,
      });
    }
  }

  const senalesCriticas = cliente.senales.filter(s => s.es_critica).length;
  if (senalesCriticas > 0) {
    penalizaciones.push({
      motivo: `${senalesCriticas} señal(es) crítica(s)`,
      puntos: PESOS.senalCriticaUnitaria * senalesCriticas,
    });
  }

  const noCriticas = cliente.senales.length - senalesCriticas;
  if (noCriticas > 0) {
    penalizaciones.push({
      motivo: `${noCriticas} señal(es) no crítica(s)`,
      puntos: PESOS.ratioSenalesNoCriticas * noCriticas,
    });
  }

  const facturacionFallo = cliente.senales.some(
    s => s.tipo === "FACTURACION" &&
         /fallo|rechaz|declinad/i.test(s.descripcion)
  );
  if (facturacionFallo) {
    penalizaciones.push({
      motivo: "Fallo de pago detectado",
      puntos: PESOS.falloPagoReciente,
    });
  }

  if (cliente.dias_para_renovacion <= 14) {
    penalizaciones.push({
      motivo: "Renovación en menos de 14 días",
      puntos: PESOS.renovacionCercana14d,
    });
  } else if (cliente.dias_para_renovacion <= 30) {
    penalizaciones.push({
      motivo: "Renovación en menos de 30 días",
      puntos: PESOS.renovacionCercana30d,
    });
  }

  const sumaPenalizaciones = penalizaciones.reduce((acc, p) => acc + p.puntos, 0);
  const multiplicador = TIER_MULTIPLIER[cliente.empresa.tier];
  const bruto = (HEALTH_SCORE_BASE + sumaPenalizaciones) * multiplicador;
  const scoreFinal = Math.max(0, Math.min(100, Math.round(bruto)));

  return {
    base: HEALTH_SCORE_BASE,
    penalizaciones,
    multiplicadorTier: multiplicador,
    scoreFinal,
    estadoSalud: mapearEstadoSalud(scoreFinal),
  };
}

export async function calcularEHistorizarHealthScore(
  cliente: ClienteConContexto
): Promise<ResultadoHealthScore> {
  const desglose = calcularDesgloseScore(cliente);

  const previo = await prisma.healthScore.findFirst({
    where: { cliente_id: cliente.id },
    orderBy: { fecha_registro: "desc" },
    select: { score: true },
  });

  const nuevoRegistro = await prisma.healthScore.create({
    data: {
      cliente_id: cliente.id,
      score: desglose.scoreFinal,
      estado_salud: desglose.estadoSalud,
      factores_clave: desglose as unknown as object,
    },
  });

  return {
    cliente_id: cliente.id,
    scoreAnterior: previo?.score ?? null,
    scoreNuevo: desglose.scoreFinal,
    estadoNuevo: desglose.estadoSalud,
    desglose,
    registroId: nuevoRegistro.id,
  };
}