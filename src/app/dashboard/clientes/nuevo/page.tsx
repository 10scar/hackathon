"use client";

import Link from "next/link";
import { createCliente } from "../actions";

import { ETAPA_CICLO_LABEL } from "@/lib/labels/cliente";
import type { EtapaCiclo } from "@prisma/client";

const ETAPA_ORDER = ["ONBOARDING", "ADOPCION", "RENOVACION"] as const satisfies readonly EtapaCiclo[];

export default function NuevoClientePage() {
  return (
    <div className="max-w-lg mx-auto flex flex-col gap-8 font-sans">
      <nav className="text-sm text-ink-60">
        <Link href="/dashboard/clientes" className="hover:text-moss transition-colors">
          Mis clientes
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-ink font-medium">Nuevo cliente</span>
      </nav>

      <div className="space-y-2">
        <h1 className="font-display font-medium text-4xl text-ink">Alta de cliente</h1>
        <p className="text-ink-60 text-sm">
          Los datos aparecerán en el listado y salud una vez registres puntajes.
        </p>
      </div>

      <div className="bg-white-warm rounded-2xl border border-ink-20 shadow-card p-6 md:p-8">
        <form
          className="flex flex-col gap-5"
          action={async (formData) => {
            const result = await createCliente(formData);
            if (result?.error) window.alert(result.error);
          }}
        >
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-ink mb-1.5">
              Nombre de la cuenta
            </label>
            <input
              id="nombre"
              name="nombre"
              required
              autoComplete="organization"
              placeholder="Ej. Acme Corp"
              className="w-full px-4 py-3 rounded-lg border border-ink-20 focus:outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss transition-all bg-cream"
            />
          </div>

          <div>
            <label htmlFor="mrr" className="block text-sm font-medium text-ink mb-1.5">
              MRR mensual (USD)
            </label>
            <input
              id="mrr"
              name="mrr"
              type="number"
              inputMode="decimal"
              step="any"
              min={0}
              required
              placeholder="0"
              className="w-full px-4 py-3 rounded-lg border border-ink-20 focus:outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss transition-all bg-cream"
            />
          </div>

          <div>
            <label htmlFor="etapa_ciclo" className="block text-sm font-medium text-ink mb-1.5">
              Etapa del ciclo
            </label>
            <select
              id="etapa_ciclo"
              name="etapa_ciclo"
              required
              defaultValue={ETAPA_ORDER[0]}
              className="w-full px-4 py-3 rounded-lg border border-ink-20 focus:outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss transition-all bg-cream"
            >
              {ETAPA_ORDER.map((k) => (
                <option key={k} value={k}>
                  {ETAPA_CICLO_LABEL[k]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dias_para_renovacion" className="block text-sm font-medium text-ink mb-1.5">
              Días hasta renovación
            </label>
            <input
              id="dias_para_renovacion"
              name="dias_para_renovacion"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              required
              placeholder="180"
              className="w-full px-4 py-3 rounded-lg border border-ink-20 focus:outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss transition-all bg-cream"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
            <Link
              href="/dashboard/clientes"
              className="inline-flex justify-center px-5 py-2.5 rounded-full border border-ink-20 text-ink-60 hover:bg-cream text-sm font-medium transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center px-5 py-2.5 rounded-full bg-moss text-white-warm text-sm font-medium hover:bg-moss-lt shadow-btn-primary transition-colors"
            >
              Crear cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
