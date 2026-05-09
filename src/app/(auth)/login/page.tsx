import Link from "next/link";
import Image from "next/image";
import { login } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border p-8 relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <Link href="/">
              <div className="w-12 h-12 relative mb-4">
                <Image src="/logo.png" alt="Canopy" fill className="object-contain" />
              </div>
            </Link>
            <h1 className="font-montserrat font-bold text-2xl text-secondary">Inicia Sesión</h1>
            <p className="text-text-muted mt-2 text-center">Bienvenido de vuelta a Canopy</p>
          </div>

          <form action={login} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="ejemplo@empresa.com"
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface/30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface/30"
              />
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-primary text-white font-montserrat font-semibold py-3 rounded-lg hover:bg-[#1E8449] transition-all shadow-md shadow-primary/20"
            >
              Entrar
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Crea una aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
