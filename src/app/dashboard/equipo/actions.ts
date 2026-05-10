"use server";

import { revalidatePath } from "next/cache";
import { UsuarioRol } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export type ActionState = { error?: string; success?: string } | null;

async function getCurrentEmpresa() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const dbUser = await prisma.usuario.findUnique({
    where: { id: user.id },
  });
  if (!dbUser) return null;
  return { dbUser, authId: user.id };
}

function parseRol(value: FormDataEntryValue | null): UsuarioRol | null {
  if (typeof value !== "string") return null;
  const vals = Object.values(UsuarioRol) as string[];
  return vals.includes(value) ? (value as UsuarioRol) : null;
}

export async function createUsuario(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getCurrentEmpresa();
  if (!ctx) return { error: "No autorizado." };

  const { dbUser } = ctx;
  const nombre = (formData.get("nombre") as string)?.trim();
  const emailRaw = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();
  const rol = parseRol(formData.get("rol"));

  if (!nombre || !emailRaw || !rol) {
    return { error: "Completa nombre, correo y rol." };
  }

  const admin = createAdminClient();

  if (admin) {
    if (!password || password.length < 6) {
      return { error: "Con cuenta de acceso: la contraseña debe tener al menos 6 caracteres." };
    }
    const { data: created, error } = await admin.auth.admin.createUser({
      email: emailRaw,
      password,
      email_confirm: true,
    });
    if (error || !created?.user) {
      return { error: error?.message ?? "No se pudo crear el usuario en Auth." };
    }
    try {
      await prisma.usuario.create({
        data: {
          id: created.user.id,
          empresa_id: dbUser.empresa_id,
          nombre,
          email: emailRaw,
          rol,
        },
      });
    } catch (e) {
      await admin.auth.admin.deleteUser(created.user.id);
      const msg = e instanceof Error ? e.message : "Error guardando en base de datos.";
      return { error: msg };
    }
    revalidatePath("/dashboard/equipo");
    return { success: "Usuario creado con acceso al login." };
  }

  await prisma.usuario.create({
    data: {
      empresa_id: dbUser.empresa_id,
      nombre,
      email: emailRaw,
      rol,
    },
  });
  revalidatePath("/dashboard/equipo");
  return {
    success:
      "Miembro añadido al equipo (sin cuenta Auth). Configura SUPABASE_SERVICE_ROLE_KEY para crear usuarios con login.",
  };
}

export async function updateUsuario(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getCurrentEmpresa();
  if (!ctx) return { error: "No autorizado." };

  const { dbUser } = ctx;
  const id = formData.get("id") as string;
  const nombre = (formData.get("nombre") as string)?.trim();
  const rol = parseRol(formData.get("rol"));

  if (!id || !nombre || !rol) {
    return { error: "Datos incompletos." };
  }

  const target = await prisma.usuario.findUnique({ where: { id } });
  if (!target || target.empresa_id !== dbUser.empresa_id) {
    return { error: "No autorizado." };
  }

  await prisma.usuario.update({
    where: { id },
    data: { nombre, rol },
  });
  revalidatePath("/dashboard/equipo");
  return { success: "Usuario actualizado." };
}

export async function deleteUsuario(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await getCurrentEmpresa();
  if (!ctx) return { error: "No autorizado." };

  const { dbUser, authId } = ctx;
  const id = formData.get("id") as string;
  if (!id) return { error: "Falta identificador." };

  if (id === authId) {
    return { error: "No puedes eliminar tu propia cuenta." };
  }

  const target = await prisma.usuario.findUnique({
    where: { id },
    include: {
      alertas: true,
    },
  });
  if (!target || target.empresa_id !== dbUser.empresa_id) {
    return { error: "No autorizado." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.alertaIntervencion.updateMany({
      where: { asignado_a: id },
      data: { asignado_a: null },
    });
    await tx.usuario.delete({ where: { id } });
  });

  const admin = createAdminClient();
  if (admin) {
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error && !error.message.includes("User not found")) {
      return { error: `Eliminado del equipo; aviso Auth: ${error.message}` };
    }
  }

  revalidatePath("/dashboard/equipo");
  return { success: "Usuario eliminado del equipo." };
}
