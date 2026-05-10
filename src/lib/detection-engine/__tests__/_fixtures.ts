import type {
    Cliente,
    Contacto,
    HealthScore,
    Senal,
    EmpresaTier,
    EstadoSalud,
    RolCuenta,
    EstadoContacto,
    TipoSenal,
    EtapaCiclo,
  } from "@prisma/client";
  import type { ClienteConContexto } from "../types";
  
  let counter = 0;
  const id = (prefix: string) => `${prefix}-${++counter}`;
  
  export function buildContacto(overrides: Partial<Contacto> = {}): Contacto {
    return {
      id: id("contacto"),
      cliente_id: "cli-1",
      nombre: "Contacto Test",
      rol_cuenta: "USUARIO_REGULAR" as RolCuenta,
      estado_actual: "ACTIVO" as EstadoContacto,
      dias_sin_login: 0,
      ...overrides,
    };
  }
  
  export function buildSenal(overrides: Partial<Senal> = {}): Senal {
    return {
      id: id("senal"),
      cliente_id: "cli-1",
      fecha_creacion: new Date(),
      tipo: "USO" as TipoSenal,
      descripcion: "Señal de prueba",
      es_critica: false,
      ...overrides,
    };
  }
  
  export function buildHealthScore(overrides: Partial<HealthScore> = {}): HealthScore {
    return {
      id: id("hs"),
      cliente_id: "cli-1",
      fecha_registro: new Date(),
      score: 80,
      estado_salud: "VERDE" as EstadoSalud,
      factores_clave: null,
      ...overrides,
    };
  }
  
  export function buildCliente(
    overrides: Partial<ClienteConContexto> = {}
  ): ClienteConContexto {
    const base: Cliente = {
      id: "cli-1",
      empresa_id: "emp-1",
      nombre: "Cliente Test",
      mrr: 10000 as unknown as Cliente["mrr"], // Decimal
      etapa_ciclo: "ADOPCION" as EtapaCiclo,
      dias_para_renovacion: 90,
    };
    return {
      ...base,
      empresa: { tier: "MID_MARKET" as EmpresaTier },
      contactos: [],
      senales: [],
      health_scores: [],
      ...overrides,
    };
  }
  
  export const diasAtras = (dias: number) =>
    new Date(Date.now() - dias * 24 * 60 * 60 * 1000);