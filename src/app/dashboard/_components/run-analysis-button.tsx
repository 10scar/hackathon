"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MENSAJES_NARRATIVOS = [
  "Ingiriendo señales del cliente...",
  "Calculando health scores...",
  "Detectando tendencias y eventos críticos...",
  "Generando recomendaciones...",
];

export function RunAnalysisButton() {
  const router = useRouter();
  const [estado, setEstado] = useState<"idle" | "loading" | "error">("idle");
  const [mensaje, setMensaje] = useState<string>("");

  async function ejecutar() {
    setEstado("loading");

    let idx = 0;
    setMensaje(MENSAJES_NARRATIVOS[0]);
    const intervalId = setInterval(() => {
      idx = (idx + 1) % MENSAJES_NARRATIVOS.length;
      setMensaje(MENSAJES_NARRATIVOS[idx]);
    }, 1500);

    try {
      const res = await fetch("/api/run-analysis", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMensaje(
        `${data.totalLinea2} alerta(s) crítica(s) · ${data.totalLinea1} en tendencia`
      );
      router.refresh();
      setTimeout(() => setEstado("idle"), 2500);
    } catch (err) {
      console.error(err);
      setEstado("error");
      setMensaje("No se pudo ejecutar el análisis");
      setTimeout(() => setEstado("idle"), 3000);
    } finally {
      clearInterval(intervalId);
    }
  }

  const disabled = estado === "loading";

  return (
    <div className="flex items-center gap-3">
      {estado !== "idle" && (
        <span
          className={`text-xs font-medium ${
            estado === "error" ? "text-rust" : "text-ink-60"
          }`}
        >
          {mensaje}
        </span>
      )}
      <button
        onClick={ejecutar}
        disabled={disabled}
        className="px-4 py-2 bg-white-warm text-moss text-sm font-medium border border-ink-20 rounded-full hover:bg-sand transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {disabled ? "Analizando..." : "⚡ Ejecutar Análisis (Demo)"}
      </button>
    </div>
  );
}