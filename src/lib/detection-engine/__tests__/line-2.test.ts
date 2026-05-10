import { describe, it, expect, beforeEach } from "vitest";
import { prismaMock, resetPrismaMock } from "./_prisma-mock";
import { detectarLinea2 } from "../line-2";
import { buildContacto, buildSenal, diasAtras } from "./_fixtures";

describe("detectarLinea2", () => {
  beforeEach(() => {
    resetPrismaMock();
    prismaMock.contacto.findMany.mockResolvedValue([]);
    prismaMock.senal.findMany.mockResolvedValue([]);
  });

  it("retorna no detectado cuando no hay señales ni contactos", async () => {
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(false);
    expect(r.triggers).toHaveLength(0);
  });

  it.each([
    "Cliente quiere cancelar el contrato",
    "Están evaluando alternativas con la competencia",
    "Mencionaron al competidor X",
    "Riesgo de churn alto",
  ])("detecta keyword de cancelación: %s", async (descripcion) => {
    prismaMock.senal.findMany.mockResolvedValue([buildSenal({ descripcion })]);
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(true);
    expect(r.triggers[0]).toMatch(/cancelación|competencia/);
  });

  it("detecta campeón que cambió de empresa", async () => {
    prismaMock.contacto.findMany.mockResolvedValue([
      buildContacto({
        nombre: "Sarah",
        rol_cuenta: "CAMPEON",
        estado_actual: "CAMBIO_DE_EMPRESA",
      }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(true);
    expect(r.triggers[0]).toContain("Sarah");
    expect(r.triggers[0]).toContain("cambió de empresa");
  });

  it("detecta campeón inactivo > 10 días", async () => {
    prismaMock.contacto.findMany.mockResolvedValue([
      buildContacto({
        nombre: "John",
        rol_cuenta: "CAMPEON",
        estado_actual: "ACTIVO",
        dias_sin_login: 15,
      }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(true);
    expect(r.triggers[0]).toContain("inactivo 15");
  });

  it("NO dispara si campeón inactivo es 10 días exactos (>10 estricto)", async () => {
    prismaMock.contacto.findMany.mockResolvedValue([
      buildContacto({
        rol_cuenta: "CAMPEON",
        estado_actual: "ACTIVO",
        dias_sin_login: 10,
      }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(false);
  });

  it("ignora inactividad de contactos NO campeones", async () => {
    prismaMock.contacto.findMany.mockResolvedValue([
      buildContacto({
        rol_cuenta: "USUARIO_REGULAR",
        dias_sin_login: 60,
      }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(false);
  });

  it("detecta 3+ señales críticas en ventana", async () => {
    prismaMock.senal.findMany.mockResolvedValue([
      buildSenal({ es_critica: true, fecha_creacion: diasAtras(1) }),
      buildSenal({ es_critica: true, fecha_creacion: diasAtras(5) }),
      buildSenal({ es_critica: true, fecha_creacion: diasAtras(10) }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(true);
    expect(r.triggers.some(t => t.includes("3 señales críticas"))).toBe(true);
  });

  it("ignora señales críticas fuera de ventana de 14 días", async () => {
    prismaMock.senal.findMany.mockResolvedValue([
      buildSenal({ es_critica: true, fecha_creacion: diasAtras(1) }),
      buildSenal({ es_critica: true, fecha_creacion: diasAtras(20) }),
      buildSenal({ es_critica: true, fecha_creacion: diasAtras(30) }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.triggers.some(t => t.includes("señales críticas"))).toBe(false);
  });

  it("NO dispara con 2 señales críticas (umbral es >=3)", async () => {
    prismaMock.senal.findMany.mockResolvedValue([
      buildSenal({ es_critica: true, fecha_creacion: diasAtras(1) }),
      buildSenal({ es_critica: true, fecha_creacion: diasAtras(2) }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(false);
  });

  it("detecta fallo de pago reciente", async () => {
    prismaMock.senal.findMany.mockResolvedValue([
      buildSenal({
        tipo: "FACTURACION",
        descripcion: "Pago rechazado, tarjeta vencida",
        fecha_creacion: diasAtras(5),
      }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.detectado).toBe(true);
    expect(r.triggers.some(t => t.includes("Fallo de pago"))).toBe(true);
  });

  it("ignora fallo de pago fuera de ventana 30d", async () => {
    prismaMock.senal.findMany.mockResolvedValue([
      buildSenal({
        tipo: "FACTURACION",
        descripcion: "Tarjeta vencida",
        fecha_creacion: diasAtras(45),
      }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.triggers.some(t => t.includes("Fallo de pago"))).toBe(false);
  });

  it("acumula múltiples triggers", async () => {
    prismaMock.contacto.findMany.mockResolvedValue([
      buildContacto({
        rol_cuenta: "CAMPEON",
        estado_actual: "CAMBIO_DE_EMPRESA",
      }),
    ]);
    prismaMock.senal.findMany.mockResolvedValue([
      buildSenal({ descripcion: "Quiere cancelar" }),
      buildSenal({
        tipo: "FACTURACION",
        descripcion: "Pago rechazado",
        fecha_creacion: diasAtras(2),
      }),
    ]);
    const r = await detectarLinea2("cli-1");
    expect(r.triggers.length).toBeGreaterThanOrEqual(3);
  });
});