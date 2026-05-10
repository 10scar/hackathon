import type {
    Cliente,
    Contacto,
    HealthScore,
    Senal,
    EstadoSalud,
    EmpresaTier,
    LineaDeteccion,
  } from "@prisma/client";
  
  export type ClienteConContexto = Cliente & {
    empresa: { tier: EmpresaTier };
    contactos: Contacto[];
    senales: Senal[];
    health_scores: HealthScore[];
  };
  
  export interface DesgloseScore {
    base: number;
    penalizaciones: { motivo: string; puntos: number }[];
    multiplicadorTier: number;
    scoreFinal: number;
    estadoSalud: EstadoSalud;
  }
  
  export interface ResultadoHealthScore {
    cliente_id: string;
    scoreAnterior: number | null;
    scoreNuevo: number;
    estadoNuevo: EstadoSalud;
    desglose: DesgloseScore;
    registroId: string;
  }
  
  export interface ResultadoLinea1 {
    detectado: boolean;
    razones: string[];
    caidaPuntos?: number;
    primeraVezEnRojo?: boolean;
  }
  
  export interface ResultadoLinea2 {
    detectado: boolean;
    triggers: string[];
  }
  
  export interface ResultadoClasificacion {
    cliente_id: string;
    cliente_nombre: string;
    healthScore: ResultadoHealthScore;
    linea1: ResultadoLinea1;
    linea2: ResultadoLinea2;
    lineaFinal: LineaDeteccion | null;
    motivoFinal: string[];
  }