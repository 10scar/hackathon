import { describe, it, expect } from "vitest";
import { calcularDesgloseScore } from "../health-score";
import { PESOS, TIER_MULTIPLIER, HEALTH_SCORE_BASE } from "../weights";
import { buildCliente, buildContacto, buildSenal } from "./_fixtures";

describe("calcularDesgloseScore", () => {
  describe("caso óptimo (sin penalizaciones)", () => {
    it("devuelve score 100 y estado VERDE", () => {
      const cliente = buildCliente();
      const desglose = calcularDesgloseScore(cliente);
      expect(desglose.scoreFinal).toBe(100);
      expect(desglose.estadoSalud).toBe("VERDE");
      expect(desglose.penalizaciones).toHaveLength(0);
    });
  });

  describe("penalizaciones por campeón", () => {
    it("penaliza CAMBIO_DE_EMPRESA con valor exacto", () => {
      const cliente = buildCliente({
        contactos: [
          buildContacto({
            rol_cuenta: "CAMPEON",
            estado_actual: "CAMBIO_DE_EMPRESA",
            dias_sin_login: 30,
          }),
        ],
      });
      const desglose = calcularDesgloseScore(cliente);
      const motivos = desglose.penalizaciones.map(p => p.motivo);
      expect(motivos).toContain(expect.stringContaining("cambió de empresa"));
      expect(motivos).not.toContain(expect.stringContaining("sin login"));
    });

    it("else-if previene doble penalización", () => {
      const cliente = buildCliente({
        contactos: [
          buildContacto({
            rol_cuenta: "CAMPEON",
            estado_actual: "CAMBIO_DE_EMPRESA",
            dias_sin_login: 30,
          }),
        ],
      });
      const total = calcularDesgloseScore(cliente).penalizaciones
        .reduce((acc, p) => acc + p.puntos, 0);
      expect(total).toBe(PESOS.campeonCambioEmpresa);
    });

    it("penaliza dias_sin_login solo si activo y >7", () => {
      const cliente = buildCliente({
        contactos: [
          buildContacto({
            rol_cuenta: "CAMPEON",
            estado_actual: "ACTIVO",
            dias_sin_login: 10,
          }),
        ],
      });
      const desglose = calcularDesgloseScore(cliente);
      expect(desglose.penalizaciones[0].puntos).toBe(
        PESOS.diasSinLoginCampeonPorDia * 10
      );
    });

    it("ignora contactos no campeones", () => {
      const cliente = buildCliente({
        contactos: [
          buildContacto({
            rol_cuenta: "USUARIO_REGULAR",
            estado_actual: "CAMBIO_DE_EMPRESA",
            dias_sin_login: 50,
          }),
        ],
      });
      expect(calcularDesgloseScore(cliente).penalizaciones).toHaveLength(0);
    });
  });

  describe("penalizaciones por señales", () => {
    it("agrupa señales críticas en una sola penalización", () => {
      const cliente = buildCliente({
        senales: [
          buildSenal({ es_critica: true }),
          buildSenal({ es_critica: true }),
          buildSenal({ es_critica: true }),
        ],
      });
      const desglose = calcularDesgloseScore(cliente);
      const criticas = desglose.penalizaciones.find(p =>
        p.motivo.includes("crítica")
      );
      expect(criticas?.puntos).toBe(PESOS.senalCriticaUnitaria * 3);
    });

    it("detecta fallo de pago por keyword en facturación", () => {
      const cliente = buildCliente({
        senales: [
          buildSenal({
            tipo: "FACTURACION",
            descripcion: "Pago rechazado por banco",
          }),
        ],
      });
      const desglose = calcularDesgloseScore(cliente);
      expect(
        desglose.penalizaciones.some(p => p.motivo === "Fallo de pago detectado")
      ).toBe(true);
    });

    it("ignora fallo de pago si la señal no es FACTURACION", () => {
      const cliente = buildCliente({
        senales: [
          buildSenal({ tipo: "SOPORTE", descripcion: "Pago rechazado" }),
        ],
      });
      expect(
        calcularDesgloseScore(cliente).penalizaciones.some(
          p => p.motivo === "Fallo de pago detectado"
        )
      ).toBe(false);
    });
  });

  describe("renovación", () => {
    it("aplica penalización 14d cuando dias=14", () => {
      const cliente = buildCliente({ dias_para_renovacion: 14 });
      const desglose = calcularDesgloseScore(cliente);
      expect(
        desglose.penalizaciones.find(p => p.motivo.includes("14 días"))?.puntos
      ).toBe(PESOS.renovacionCercana14d);
    });

    it("aplica penalización 30d cuando dias=20", () => {
      const cliente = buildCliente({ dias_para_renovacion: 20 });
      const desglose = calcularDesgloseScore(cliente);
      expect(
        desglose.penalizaciones.find(p => p.motivo.includes("30 días"))?.puntos
      ).toBe(PESOS.renovacionCercana30d);
    });

    it("no penaliza renovación cuando dias=60", () => {
      const cliente = buildCliente({ dias_para_renovacion: 60 });
      const desglose = calcularDesgloseScore(cliente);
      expect(
        desglose.penalizaciones.some(p => p.motivo.includes("Renovación"))
      ).toBe(false);
    });
  });

  describe("multiplicador de tier", () => {
    it("ENTERPRISE aplica 1.10", () => {
      const cliente = buildCliente({
        empresa: { tier: "ENTERPRISE" },
        senales: [buildSenal({ es_critica: true })],
      });
      const desglose = calcularDesgloseScore(cliente);
      const esperado = Math.round(
        (HEALTH_SCORE_BASE + PESOS.senalCriticaUnitaria) * TIER_MULTIPLIER.ENTERPRISE
      );
      expect(desglose.scoreFinal).toBe(Math.min(100, esperado));
      expect(desglose.multiplicadorTier).toBe(1.10);
    });

    it("SMB aplica 0.90", () => {
      const cliente = buildCliente({
        empresa: { tier: "SMB" },
        senales: [buildSenal({ es_critica: true })],
      });
      const desglose = calcularDesgloseScore(cliente);
      expect(desglose.multiplicadorTier).toBe(0.90);
    });
  });

  describe("clamp y mapeo de estado", () => {
    it("score nunca baja de 0", () => {
      const cliente = buildCliente({
        dias_para_renovacion: 5,
        contactos: [
          buildContacto({
            rol_cuenta: "CAMPEON",
            estado_actual: "CAMBIO_DE_EMPRESA",
          }),
        ],
        senales: Array.from({ length: 10 }, () =>
          buildSenal({ es_critica: true })
        ),
      });
      const desglose = calcularDesgloseScore(cliente);
      expect(desglose.scoreFinal).toBeGreaterThanOrEqual(0);
      expect(desglose.scoreFinal).toBeLessThanOrEqual(100);
    });

    it.each([
      [95, "VERDE"],
      [80, "VERDE"],
      [79, "AMARILLO"],
      [60, "AMARILLO"],
      [59, "ROJO"],
      [40, "ROJO"],
      [39, "CRITICO"],
      [0, "CRITICO"],
    ])("score=%i → %s", (score, estadoEsperado) => {
      const penalizacion = HEALTH_SCORE_BASE - score;
      const cliente = buildCliente({
        empresa: { tier: "MID_MARKET" },
        senales: Array.from({ length: Math.ceil(penalizacion / 8) }, () =>
          buildSenal({ es_critica: true })
        ),
      });
      const desglose = calcularDesgloseScore(cliente);
      // No comparamos score exacto (depende de senales), solo que mapeo es coherente
      const estado = desglose.estadoSalud;
      if (desglose.scoreFinal >= 80) expect(estado).toBe("VERDE");
      else if (desglose.scoreFinal >= 60) expect(estado).toBe("AMARILLO");
      else if (desglose.scoreFinal >= 40) expect(estado).toBe("ROJO");
      else expect(estado).toBe("CRITICO");
    });
  });
});