import { describe, it, expect, beforeEach, vi } from "vitest";
import { prismaMock, resetPrismaMock } from "./_prisma-mock";

vi.mock("../health-score", () => ({
  calcularEHistorizarHealthScore: vi.fn(),
}));
vi.mock("../line-1", () => ({
  detectarLinea1: vi.fn(),
}));
vi.mock("../line-2", () => ({
  detectarLinea2: vi.fn(),
}));

import { clasificarCliente } from "../classifier";
import { calcularEHistorizarHealthScore } from "../health-score";
import { detectarLinea1 } from "../line-1";
import { detectarLinea2 } from "../line-2";
import { buildCliente } from "./_fixtures";

const mockHealth = calcularEHistorizarHealthScore as ReturnType<typeof vi.fn>;
const mockL1 = detectarLinea1 as ReturnType<typeof vi.fn>;
const mockL2 = detectarLinea2 as ReturnType<typeof vi.fn>;

const healthFake = {
  cliente_id: "cli-1",
  scoreAnterior: 80,
  scoreNuevo: 50,
  estadoNuevo: "ROJO" as const,
  desglose: {
    base: 100,
    penalizaciones: [],
    multiplicadorTier: 1,
    scoreFinal: 50,
    estadoSalud: "ROJO" as const,
  },
  registroId: "hs-new",
};

describe("clasificarCliente", () => {
  beforeEach(() => {
    resetPrismaMock();
    mockHealth.mockReset();
    mockL1.mockReset();
    mockL2.mockReset();
    mockHealth.mockResolvedValue(healthFake);
    prismaMock.alertaIntervencion.findFirst.mockResolvedValue(null);
    prismaMock.alertaIntervencion.create.mockResolvedValue({});
    prismaMock.alertaIntervencion.update.mockResolvedValue({});
  });

  it("siempre calcula health score primero", async () => {
    mockL2.mockResolvedValue({ detectado: false, triggers: [] });
    mockL1.mockResolvedValue({ detectado: false, razones: [] });
    await clasificarCliente(buildCliente());
    expect(mockHealth).toHaveBeenCalledTimes(1);
  });

  it("L2 prevalece sobre L1 (corto-circuito)", async () => {
    mockL2.mockResolvedValue({
      detectado: true,
      triggers: ["Campeón cambió"],
    });
    const r = await clasificarCliente(buildCliente());
    expect(r.lineaFinal).toBe("LINEA_2");
    expect(mockL1).not.toHaveBeenCalled();
    expect(r.linea1.detectado).toBe(false);
  });

  it("clasifica como L1 cuando L2=false y L1=true", async () => {
    mockL2.mockResolvedValue({ detectado: false, triggers: [] });
    mockL1.mockResolvedValue({
      detectado: true,
      razones: ["Caída fuerte"],
      caidaPuntos: 20,
    });
    const r = await clasificarCliente(buildCliente());
    expect(r.lineaFinal).toBe("LINEA_1");
    expect(r.motivoFinal).toEqual(["Caída fuerte"]);
  });

  it("no crea alerta si ningún detector dispara", async () => {
    mockL2.mockResolvedValue({ detectado: false, triggers: [] });
    mockL1.mockResolvedValue({ detectado: false, razones: [] });
    const r = await clasificarCliente(buildCliente());
    expect(r.lineaFinal).toBeNull();
    expect(prismaMock.alertaIntervencion.create).not.toHaveBeenCalled();
    expect(prismaMock.alertaIntervencion.update).not.toHaveBeenCalled();
  });

  it("crea nueva alerta L2 con SLA de 45 minutos", async () => {
    mockL2.mockResolvedValue({ detectado: true, triggers: ["X"] });
    const antes = Date.now();
    await clasificarCliente(buildCliente());
    expect(prismaMock.alertaIntervencion.create).toHaveBeenCalledTimes(1);
    const data = prismaMock.alertaIntervencion.create.mock.calls[0][0].data;
    expect(data.linea_deteccion).toBe("LINEA_2");
    const sla = (data.sla_vencimiento as Date).getTime();
    const esperado = antes + 45 * 60 * 1000;
    expect(Math.abs(sla - esperado)).toBeLessThan(2000);
  });

  it("actualiza alerta PENDIENTE existente en lugar de duplicar", async () => {
    mockL2.mockResolvedValue({ detectado: true, triggers: ["X"] });
    prismaMock.alertaIntervencion.findFirst.mockResolvedValue({
      id: "alert-existente",
    });
    await clasificarCliente(buildCliente());
    expect(prismaMock.alertaIntervencion.update).toHaveBeenCalledWith({
      where: { id: "alert-existente" },
      data: expect.objectContaining({ linea_deteccion: "LINEA_2" }),
    });
    expect(prismaMock.alertaIntervencion.create).not.toHaveBeenCalled();
  });

  it("incluye los motivos en nota_interna", async () => {
    mockL2.mockResolvedValue({
      detectado: true,
      triggers: ["Campeón cambió", "Fallo de pago"],
    });
    await clasificarCliente(buildCliente());
    const data = prismaMock.alertaIntervencion.create.mock.calls[0][0].data;
    expect(data.nota_interna).toContain("Campeón cambió");
    expect(data.nota_interna).toContain("Fallo de pago");
  });

  it("propaga el resultado de health score", async () => {
    mockL2.mockResolvedValue({ detectado: false, triggers: [] });
    mockL1.mockResolvedValue({ detectado: false, razones: [] });
    const r = await clasificarCliente(buildCliente());
    expect(r.healthScore.scoreNuevo).toBe(50);
    expect(r.healthScore.estadoNuevo).toBe("ROJO");
  });
});