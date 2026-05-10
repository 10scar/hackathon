import { vi } from "vitest";

export const prismaMock = {
  healthScore: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  contacto: {
    findMany: vi.fn(),
  },
  senal: {
    findMany: vi.fn(),
  },
  alertaIntervencion: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

export function resetPrismaMock() {
  Object.values(prismaMock).forEach(table =>
    Object.values(table).forEach(fn => (fn as ReturnType<typeof vi.fn>).mockReset())
  );
}