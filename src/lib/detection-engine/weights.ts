import { EmpresaTier, EstadoSalud, LineaDeteccion } from "@prisma/client";

export const HEALTH_SCORE_BASE = 100;

export const PESOS = {
  diasSinLoginCampeonPorDia: -2,
  campeonNoResponde: -10,
  campeonCambioEmpresa: -25,
  senalCriticaUnitaria: -8,
  falloPagoReciente: -15,
  renovacionCercana30d: -10,
  renovacionCercana14d: -20,
  ratioSenalesNoCriticas: -1,
} as const;

export const TIER_MULTIPLIER: Record<EmpresaTier, number> = {
  ENTERPRISE: 1.10,
  MID_MARKET: 1.00,
  SMB: 0.90,
};

export const UMBRALES_SCORE: { min: number; estado: EstadoSalud }[] = [
  { min: 80, estado: "VERDE" },
  { min: 60, estado: "AMARILLO" },
  { min: 40, estado: "ROJO" },
  { min: 0, estado: "CRITICO" },
];

export const CRITERIO_LINEA_1 = {
  caidaScoreMinima: 10,
  ventanaDias: 7,
} as const;

export const CRITERIO_LINEA_2 = {
  keywordsCancelacion: [
    "cancel", "cancelar", "cancelación",
    "competencia", "competidor",
    "churn", "descontent", "renunciar",
    "evaluando alternativas",
  ],
  diasInactividadCampeon: 10,
  senalesCriticasMinimas: 3,
  ventanaSenalesCriticasDias: 14,
  ventanaFalloPagoDias: 30,
  keywordsFalloPago: ["fallo", "rechazado", "tarjeta declinada", "vencida"],
} as const;

export const SLA_MINUTOS: Record<LineaDeteccion, number> = {
  LINEA_1: 24 * 60,
  LINEA_2: 45,
};