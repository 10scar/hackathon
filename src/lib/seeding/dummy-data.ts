import { 
  EtapaCiclo, 
  EstadoSalud, 
  RolCuenta, 
  EstadoContacto, 
  TipoSenal,
  LineaDeteccion,
  TipoOutput,
  EstadoAlerta
} from '@prisma/client';

export const DUMMY_CLIENTES = [
  {
    nombre: "Acme Corp",
    mrr: 15000,
    etapa_ciclo: EtapaCiclo.RENOVACION,
    dias_para_renovacion: 45,
    health_scores: [
      { score: 85, estado_salud: EstadoSalud.VERDE, offsetDays: -30 },
      { score: 72, estado_salud: EstadoSalud.AMARILLO, offsetDays: -15 },
      { score: 45, estado_salud: EstadoSalud.ROJO, offsetDays: 0 },
    ],
    contactos: [
      { nombre: "Sarah Connor", rol_cuenta: RolCuenta.CAMPEON, estado_actual: EstadoContacto.CAMBIO_DE_EMPRESA, dias_sin_login: 20 },
      { nombre: "John Smith", rol_cuenta: RolCuenta.COMPRADOR_ECONOMICO, estado_actual: EstadoContacto.ACTIVO, dias_sin_login: 5 },
    ],
    senales: [
      { tipo: TipoSenal.USO, descripcion: "Caída drástica en la creación de nuevos proyectos (-40%).", es_critica: false, offsetDays: -10 },
      { tipo: TipoSenal.SOPORTE, descripcion: "El campeón principal ya no responde los correos de revisión mensual.", es_critica: true, offsetDays: -2 },
    ],
    alertas: [
      {
        linea_deteccion: LineaDeteccion.LINEA_2,
        emocion_detectada: "Incertidumbre",
        tipo_output: TipoOutput.A_REUNION,
        mensaje_generado: "Hola John, he notado algunos cambios recientes en su uso de la plataforma. Me gustaría agendar 15 min para asegurar que siguen obteniendo el máximo valor para Acme Corp.",
        nota_interna: "Sarah (Campeona) parece haber dejado la empresa. Riesgo crítico de churn a 45 días de renovación.",
        estado: EstadoAlerta.PENDIENTE,
        slaOffsetMins: 45
      }
    ]
  },
  {
    nombre: "Globex Analytics",
    mrr: 8500,
    etapa_ciclo: EtapaCiclo.ADOPCION,
    dias_para_renovacion: 180,
    health_scores: [
      { score: 90, estado_salud: EstadoSalud.VERDE, offsetDays: -30 },
      { score: 92, estado_salud: EstadoSalud.VERDE, offsetDays: -15 },
      { score: 95, estado_salud: EstadoSalud.VERDE, offsetDays: 0 },
    ],
    contactos: [
      { nombre: "Michael Scott", rol_cuenta: RolCuenta.COMPRADOR_ECONOMICO, estado_actual: EstadoContacto.ACTIVO, dias_sin_login: 2 },
    ],
    senales: [],
    alertas: []
  },
  {
    nombre: "TechFlow Inc.",
    mrr: 21000,
    etapa_ciclo: EtapaCiclo.ONBOARDING,
    dias_para_renovacion: 300,
    health_scores: [
      { score: 60, estado_salud: EstadoSalud.AMARILLO, offsetDays: -10 },
      { score: 55, estado_salud: EstadoSalud.AMARILLO, offsetDays: 0 },
    ],
    contactos: [
      { nombre: "Elena Rodriguez", rol_cuenta: RolCuenta.USUARIO_REGULAR, estado_actual: EstadoContacto.ACTIVO, dias_sin_login: 8 },
    ],
    senales: [
      { tipo: TipoSenal.SOPORTE, descripcion: "Abrió 4 tickets de soporte técnicos relacionados con la integración inicial.", es_critica: false, offsetDays: -1 },
    ],
    alertas: [
      {
        linea_deteccion: LineaDeteccion.LINEA_1,
        emocion_detectada: "Frustración Técnica",
        tipo_output: TipoOutput.B_ASINCRONO,
        mensaje_generado: "Hola Elena, noté que la integración técnica ha presentado algunos retos. Aquí tienes una guía en video exclusiva para tu stack.",
        nota_interna: "Onboarding estancado por barreras técnicas. Enviar documentación asíncrona.",
        estado: EstadoAlerta.PENDIENTE,
        slaOffsetMins: 120
      }
    ]
  },
  // Cliente 4 - Saludable
  {
    nombre: "Nova Health",
    mrr: 35000,
    etapa_ciclo: EtapaCiclo.ADOPCION,
    dias_para_renovacion: 210,
    health_scores: [{ score: 88, estado_salud: EstadoSalud.VERDE, offsetDays: 0 }],
    contactos: [], senales: [], alertas: []
  },
  // Cliente 5 - Crítico
  {
    nombre: "Stark Industries",
    mrr: 50000,
    etapa_ciclo: EtapaCiclo.RENOVACION,
    dias_para_renovacion: 15,
    health_scores: [
      { score: 70, estado_salud: EstadoSalud.AMARILLO, offsetDays: -30 },
      { score: 40, estado_salud: EstadoSalud.ROJO, offsetDays: 0 },
    ],
    contactos: [
      { nombre: "Tony S.", rol_cuenta: RolCuenta.COMPRADOR_ECONOMICO, estado_actual: EstadoContacto.NO_RESPONDE, dias_sin_login: 25 }
    ],
    senales: [
      { tipo: TipoSenal.FACTURACION, descripcion: "Fallo de pago en la última factura.", es_critica: true, offsetDays: -3 },
      { tipo: TipoSenal.COMERCIAL, descripcion: "Mención de competidor en último ticket.", es_critica: true, offsetDays: -1 }
    ],
    alertas: [
      {
        linea_deteccion: LineaDeteccion.LINEA_2,
        emocion_detectada: "Insatisfacción",
        tipo_output: TipoOutput.A_REUNION,
        mensaje_generado: "Tony, sabemos que la última factura presentó inconvenientes y queremos asegurarnos de que la plataforma siga cumpliendo tus expectativas.",
        nota_interna: "Riesgo de pérdida de $50k MRR inminente. 2 señales críticas simultáneas.",
        estado: EstadoAlerta.PENDIENTE,
        slaOffsetMins: 30
      }
    ]
  },
  // Cliente 6
  {
    nombre: "Wayne Enterprises",
    mrr: 12000,
    etapa_ciclo: EtapaCiclo.ADOPCION,
    dias_para_renovacion: 90,
    health_scores: [{ score: 95, estado_salud: EstadoSalud.VERDE, offsetDays: 0 }],
    contactos: [], senales: [], alertas: []
  },
  // Cliente 7
  {
    nombre: "Dunder Mifflin",
    mrr: 4500,
    etapa_ciclo: EtapaCiclo.ONBOARDING,
    dias_para_renovacion: 350,
    health_scores: [{ score: 65, estado_salud: EstadoSalud.AMARILLO, offsetDays: 0 }],
    contactos: [], senales: [], alertas: []
  },
  // Cliente 8
  {
    nombre: "Pied Piper",
    mrr: 28000,
    etapa_ciclo: EtapaCiclo.RENOVACION,
    dias_para_renovacion: 60,
    health_scores: [
      { score: 90, estado_salud: EstadoSalud.VERDE, offsetDays: -14 },
      { score: 85, estado_salud: EstadoSalud.VERDE, offsetDays: 0 }
    ],
    contactos: [], senales: [], alertas: []
  }
];
