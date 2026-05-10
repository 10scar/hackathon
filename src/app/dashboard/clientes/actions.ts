"use server";

import { EtapaCiclo } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

const ETAPAS_VALIDAS = new Set<string>(["ONBOARDING", "ADOPCION", "RENOVACION"]);

export async function createCliente(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "No estás autenticado." };

  const dbUser = await prisma.usuario.findUnique({ where: { id: user.id } });
  if (!dbUser) return { error: "Usuario no encontrado en la cuenta." };

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const mrrStr = String(formData.get("mrr") ?? "").replace(/\s+/g, "").replace(/,/g, "");
  const mrr = Number.parseFloat(mrrStr);
  if (!Number.isFinite(mrr) || mrr < 0) return { error: "Indica un MRR válido (número ≥ 0)." };

  const etapaRaw = String(formData.get("etapa_ciclo") ?? "");
  if (!ETAPAS_VALIDAS.has(etapaRaw)) return { error: "Selecciona una etapa del ciclo." };
  const etapa_ciclo = etapaRaw as EtapaCiclo;

  const diasParsed = Number.parseInt(String(formData.get("dias_para_renovacion") ?? ""), 10);
  if (!Number.isFinite(diasParsed) || diasParsed < 0) {
    return { error: "Los días hasta renovación deben ser un entero ≥ 0." };
  }

  const cliente = await prisma.cliente.create({
    data: {
      empresa_id: dbUser.empresa_id,
      nombre,
      mrr,
      etapa_ciclo,
      dias_para_renovacion: diasParsed,
    },
  });

  revalidatePath("/dashboard/clientes");
  redirect(`/dashboard/clientes/${cliente.id}`);
}
