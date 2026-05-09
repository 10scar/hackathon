import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

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

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 relative bg-white rounded-full p-1">
             <Image src="/logo.png" alt="Canopy" fill className="object-contain" />
          </div>
          <span className="font-montserrat font-bold text-xl text-white">Canopy</span>
        </div>
        
        <div className="p-4 flex-1 mt-4">
          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className="px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-medium text-sm">
              Vista Gerencial
            </Link>
            <Link href="/dashboard/clientes" className="px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-medium text-sm">
              Mis Clientes
            </Link>
            <Link href="/dashboard/alertas" className="px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-medium text-sm flex justify-between items-center">
              Alertas Activas
              <span className="bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 text-sm">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-inner">
               {dbUser?.nombre.charAt(0).toUpperCase() || "U"}
             </div>
             <div className="overflow-hidden">
               <p className="text-white font-semibold truncate">{dbUser?.nombre}</p>
               <p className="text-primary text-xs truncate">{dbUser?.empresa.nombre}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-border px-8 flex items-center justify-between shadow-sm z-10">
          <h1 className="font-montserrat font-bold text-2xl text-secondary">
            Workspace
          </h1>
          {/* Quick actions for Demo */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-surface text-primary text-sm font-semibold border border-primary/20 rounded-md hover:bg-primary/10 transition-colors shadow-sm">
               ⚡ Ejecutar Análisis (Demo)
            </button>
            <form action="/auth/signout" method="post">
              <button className="text-text-muted hover:text-error transition-colors text-sm font-medium border border-transparent hover:border-error/20 px-3 py-1.5 rounded-md">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
