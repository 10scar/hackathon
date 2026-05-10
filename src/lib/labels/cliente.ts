import type { EstadoSalud, EtapaCiclo } from "@prisma/client";

export const ESTADO_SALUD_LABEL: Record<EstadoSalud, string> = {
  VERDE: "Verde — estable",
  AMARILLO: "Amarillo — atención",
  ROJO: "Rojo — riesgo",
  CRITICO: "Crítico",
};

export const ETAPA_CICLO_LABEL: Record<EtapaCiclo, string> = {
  ONBOARDING: "Onboarding",
  ADOPCION: "Adopción",
  RENOVACION: "Renovación",
};
