import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { ejecutarAnalisisParaEmpresa } from "@/lib/detection-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 },
    );
  }

  const dbUser = await prisma.usuario.findUnique({
    where: { id: user.id },
    select: { empresa_id: true },
  });

  if (!dbUser) {
    return NextResponse.json(
      { error: "Usuario sin empresa asociada" },
      { status: 404 },
    );
  }

  try {
    const resumen = await ejecutarAnalisisParaEmpresa(dbUser.empresa_id);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/alertas");
    revalidatePath("/dashboard/clientes");

    return NextResponse.json(resumen, { status: 200 });
  } catch (error) {
    console.error("[run-analysis] Error en motor de detección:", error);
    return NextResponse.json(
      { error: "Error al ejecutar el análisis" },
      { status: 500 },
    );
  }
}
