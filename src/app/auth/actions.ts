"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { injectDummiesForTenant } from "@/lib/seeding/inject";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const empresaNombre = formData.get("empresa") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Si no hay error y tenemos un usuario, inyectamos los datos de prueba
  if (data.user) {
    try {
      // Pasamos el email como nombre de usuario por ahora
      await injectDummiesForTenant(data.user.id, empresaNombre, email.split("@")[0]);
    } catch (seedError) {
      console.error("Error inyectando datos de prueba:", seedError);
      return { error: "Error creando el entorno de demostración." };
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
