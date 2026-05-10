"use client";

import { useActionState, useEffect } from "react";
import { createUsuario, type ActionState } from "./actions";
import { usuarioRolOptions } from "@/lib/labels/usuario-rol";

const initial: ActionState = null;

export function CreateUserForm({ hasAuthProvisioning }: { hasAuthProvisioning: boolean }) {
  const [state, action, pending] = useActionState(createUsuario, initial);

  useEffect(() => {
    if (state?.success || state?.error) {
      const el = document.getElementById("create-user-form");
      if (state?.success && el) (el as HTMLFormElement).reset();
    }
  }, [state]);

  return (
    <div className="bg-white-warm rounded-2xl border border-ink-20 shadow-card p-6">
      <h3 className="font-display text-xl text-ink font-medium mb-1">Añadir miembro</h3>
      <p className="text-sm text-ink-60 mb-5">
        {hasAuthProvisioning
          ? "Se creará una cuenta con acceso al login (Supabase Auth)."
          : "Se guardará en el equipo sin login. Añade SUPABASE_SERVICE_ROLE_KEY en el servidor para provisionar acceso."}
      </p>

      {state?.error && (
        <p className="text-sm text-risk-accent mb-4 px-3 py-2 rounded-lg bg-risk-accent/10 border border-risk-accent/20">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-moss mb-4 px-3 py-2 rounded-lg bg-leaf/10 border border-moss/20">{state.success}</p>
      )}

      <form id="create-user-form" action={action} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-ink-60 uppercase tracking-wider mb-1.5">Nombre</label>
          <input
            name="nombre"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-ink-20 bg-cream focus:outline-none focus:ring-2 focus:ring-moss/25 focus:border-moss text-ink"
            placeholder="María García"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-ink-60 uppercase tracking-wider mb-1.5">Correo</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-ink-20 bg-cream focus:outline-none focus:ring-2 focus:ring-moss/25 focus:border-moss text-ink"
            placeholder="maria@empresa.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-60 uppercase tracking-wider mb-1.5">Rol</label>
          <select
            name="rol"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-ink-20 bg-cream focus:outline-none focus:ring-2 focus:ring-moss/25 focus:border-moss text-ink"
          >
            {usuarioRolOptions().map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-60 uppercase tracking-wider mb-1.5">
            Contraseña {hasAuthProvisioning ? "" : "(opcional, sin Auth)"}
          </label>
          <input
            name="password"
            type="password"
            minLength={hasAuthProvisioning ? 6 : 0}
            required={hasAuthProvisioning}
            className="w-full px-4 py-2.5 rounded-xl border border-ink-20 bg-cream focus:outline-none focus:ring-2 focus:ring-moss/25 focus:border-moss text-ink"
            placeholder={hasAuthProvisioning ? "Mínimo 6 caracteres" : "—"}
            disabled={!hasAuthProvisioning}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="w-full md:w-auto px-8 py-3 rounded-full bg-moss text-white-warm font-medium shadow-btn-primary hover:bg-moss-lt transition-all disabled:opacity-60"
          >
            {pending ? "Creando…" : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
