"use client";

import Link from "next/link";
import Image from "next/image";
import { signup } from "@/app/auth/actions";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-6">
      <div className="w-full max-w-md bg-white-warm rounded-2xl shadow-card border border-ink-20 p-8 relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-moss/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-leaf-lt/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <Link href="/">
              <div className="w-12 h-12 relative mb-4">
                <Image src="/logo.png" alt="Canopy" fill sizes="48px" className="object-contain" />
              </div>
            </Link>
            <h1 className="font-display font-medium text-3xl text-ink text-center">Crea tu cuenta</h1>
            <p className="text-ink-60 mt-2 text-center text-sm font-sans leading-relaxed">
              Al registrarte, Canopy generará automáticamente un entorno de demostración con clientes simulados para ti.
            </p>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const res = await signup(formData);
            if (res?.error) alert(res.error);
          }} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-sans" htmlFor="empresa">
                Nombre de la Empresa
              </label>
              <input
                id="empresa"
                name="empresa"
                type="text"
                required
                placeholder="Acme Corp"
                className="w-full px-4 py-3 rounded-lg border border-ink-20 focus:outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss transition-all bg-cream font-sans"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-sans" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="ejemplo@empresa.com"
                className="w-full px-4 py-3 rounded-lg border border-ink-20 focus:outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss transition-all bg-cream font-sans"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5 font-sans" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-ink-20 focus:outline-none focus:ring-2 focus:ring-moss/20 focus:border-moss transition-all bg-cream font-sans"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-moss text-white-warm font-sans font-medium py-3 rounded-full hover:bg-moss-lt transition-all shadow-btn-primary"
            >
              Registrarse y Generar Demo
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-60 font-sans">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-moss hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
