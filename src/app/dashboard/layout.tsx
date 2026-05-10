import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { RunAnalysisButton } from "./_components/run-analysis-button";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Obtener el usuario de la DB
  const dbUser = await prisma.usuario.findUnique({
    where: { id: user.id },
    include: { empresa: true }
  });

  const pendingAlertas = dbUser
    ? await prisma.alertaIntervencion.count({
        where: {
          estado: "PENDIENTE",
          cliente: { empresa_id: dbUser.empresa_id },
        },
      })
    : 0;

  return (
    <div className="flex h-screen bg-cream font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-ink flex flex-col shadow-xl z-20 text-cream-80">
        <div className="p-6 flex items-center gap-3 border-b border-cream/10">
          <div className="w-8 h-8 relative bg-white-warm rounded-full p-1">
             <Image src="/logo.png" alt="Canopy" fill sizes="32px" className="object-contain" />
          </div>
          <span className="font-display font-medium text-2xl text-cream">Canopy</span>
        </div>
        
        <div className="p-4 flex-1 mt-4">
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="px-4 py-3 rounded-lg text-cream-80 hover:bg-cream/10 hover:text-cream transition-colors font-medium text-sm">
              Vista gerencial
            </Link>
            <Link href="/dashboard/clientes" className="px-4 py-3 rounded-lg text-cream-80 hover:bg-cream/10 hover:text-cream transition-colors font-medium text-sm">
              Mis clientes
            </Link>
            <Link href="/dashboard/equipo" className="px-4 py-3 rounded-lg text-cream-80 hover:bg-cream/10 hover:text-cream transition-colors font-medium text-sm">
              Equipo
            </Link>
            <Link href="/dashboard/alertas" className="px-4 py-3 rounded-lg text-cream-80 hover:bg-cream/10 hover:text-cream transition-colors font-medium text-sm flex justify-between items-center">
              Alertas activas
              {pendingAlertas > 0 ? (
                <span className="bg-risk-accent text-white-warm text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingAlertas}
                </span>
              ) : (
                <span className="text-cream/40 text-xs font-medium">0</span>
              )}
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-cream/10 text-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-moss rounded-full flex items-center justify-center text-white-warm font-bold shadow-inner">
               {dbUser?.nombre.charAt(0).toUpperCase() || "U"}
             </div>
             <div className="overflow-hidden">
               <p className="text-cream font-medium truncate">{dbUser?.nombre}</p>
               <p className="text-leaf-lt text-xs truncate">{dbUser?.empresa?.nombre}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-cream/80 backdrop-blur-md border-b border-ink-20 px-8 flex items-center justify-between z-10">
          <h1 className="font-display font-medium text-2xl text-ink">
            Workspace
          </h1>
          {/* Quick actions for Demo */}
          <div className="flex items-center gap-4">
            <RunAnalysisButton />
            <form action="/auth/signout" method="post">
              <button className="text-ink-60 hover:text-rust transition-colors text-sm font-medium border border-transparent hover:border-rust/20 px-3 py-1.5 rounded-md">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-cream">
          {children}
        </div>
      </main>
    </div>
  );
}
