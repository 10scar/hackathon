import { describe, it, expect, beforeEach } from "vitest";
import { prismaMock, resetPrismaMock } from "./_prisma-mock";
import { detectarLinea1 } from "../line-1";
import { buildHealthScore, diasAtras } from "./_fixtures";

describe("detectarLinea1", () => {
  beforeEach(() => resetPrismaMock());

  it("retorna no detectado cuando no hay historial", async () => {
    prismaMock.healthScore.findMany.mockResolvedValue([]);
    const r = await detectarLinea1("cli-1");
    expect(r.detectado).toBe(false);
    expect(r.razones).toHaveLength(0);
  });

  it("detecta caída > 10 puntos en ventana de 7 días", async () => {
    prismaMock.healthScore.findMany.mockResolvedValue([
      buildHealthScore({ score: 60, estado_salud: "AMARILLO", fecha_registro: diasAtras(0) }),
      buildHealthScore({ score: 80, estado_salud: "VERDE", fecha_registro: diasAtras(3) }),
    ]);
    const r = await detectarLinea1("cli-1");
    expect(r.detectado).toBe(true);
    expect(r.caidaPuntos).toBe(20);
    expect(r.razones[0]).toMatch(/Caída de 20 puntos/);
  });

  it("NO detecta caída de exactamente 10 puntos (umbral es >10)", async () => {
    prismaMock.healthScore.findMany.mockResolvedValue([
      buildHealthScore({ score: 70, estado_salud: "AMARILLO", fecha_registro: diasAtras(0) }),
      buildHealthScore({ score: 80, estado_salud: "VERDE", fecha_registro: diasAtras(3) }),
    ]);
    const r = await detectarLinea1("cli-1");
    expect(r.detectado).toBe(false);
  });

  it("ignora registros fuera de ventana de 7 días para la caída", async () => {
    prismaMock.healthScore.findMany.mockResolvedValue([
      buildHealthScore({ score: 75, estado_salud: "AMARILLO", fecha_registro: diasAtras(0) }),
      buildHealthScore({ score: 95, estado_salud: "VERDE", fecha_registro: diasAtras(20) }),
    ]);
    const r = await detectarLinea1("cli-1");
    expect(r.detectado).toBe(false);
    expect(r.caidaPuntos).toBe(0);
  });

  it("detecta primera vez en zona ROJO", async () => {
    prismaMock.healthScore.findMany.mockResolvedValue([
      buildHealthScore({ score: 45, estado_salud: "ROJO", fecha_registro: diasAtras(0) }),
      buildHealthScore({ score: 70, estado_salud: "AMARILLO", fecha_registro: diasAtras(5) }),
      buildHealthScore({ score: 85, estado_salud: "VERDE", fecha_registro: diasAtras(15) }),
    ]);
    const r = await detectarLinea1("cli-1");
    expect(r.detectado).toBe(true);
    expect(r.primeraVezEnRojo).toBe(true);
    expect(r.razones).toEqual(
      expect.arrayContaining([expect.stringContaining("primera vez")])
    );
  });

  it("CRITICO también cuenta como primera vez en rojo", async () => {
    prismaMock.healthScore.findMany.mockResolvedValue([
      buildHealthScore({ score: 25, estado_salud: "CRITICO", fecha_registro: diasAtras(0) }),
      buildHealthScore({ score: 70, estado_salud: "AMARILLO", fecha_registro: diasAtras(5) }),
    ]);
    const r = await detectarLinea1("cli-1");
    expect(r.primeraVezEnRojo).toBe(true);
  });

  it("NO es primera vez si ya estuvo en ROJO antes", async () => {
    prismaMock.healthScore.findMany.mockResolvedValue([
      buildHealthScore({ score: 45, estado_salud: "ROJO", fecha_registro: diasAtras(0) }),
      buildHealthScore({ score: 50, estado_salud: "ROJO", fecha_registro: diasAtras(15) }),
      buildHealthScore({ score: 85, estado_salud: "VERDE", fecha_registro: diasAtras(30) }),
    ]);
    const r = await detectarLinea1("cli-1");
    expect(r.primeraVezEnRojo).toBe(false);
  });

  it("dispara ambas razones cuando aplica caída + primera vez en rojo", async () => {
    prismaMock.healthScore.findMany.mockResolvedValue([
      buildHealthScore({ score: 35, estado_salud: "CRITICO", fecha_registro: diasAtras(0) }),
      buildHealthScore({ score: 80, estado_salud: "VERDE", fecha_registro: diasAtras(3) }),
    ]);
    const r = await detectarLinea1("cli-1");
    expect(r.detectado).toBe(true);
    expect(r.razones).toHaveLength(2);
  });
});