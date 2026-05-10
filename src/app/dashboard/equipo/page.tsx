import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateUserForm } from "./create-user-form";
import { UserRow } from "./user-row";
import { canManageAuthUsers } from "@/utils/supabase/admin";

export default async function EquipoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.usuario.findUnique({
    where: { id: user.id },
  });
  if (!dbUser) redirect("/login");

  const miembros = await prisma.usuario.findMany({
    where: { empresa_id: dbUser.empresa_id },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, email: true, rol: true },
  });

  const hasAuthProvisioning = canManageAuthUsers();

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 font-sans">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-moss">Gestión</p>
        <h2 className="font-display font-medium text-4xl text-ink tracking-tight">Equipo</h2>
        <p className="text-ink-60 max-w-xl">
          Administra roles del equipo interno. Las alertas pueden asignarse a estos perfiles.
        </p>
      </header>

      <CreateUserForm hasAuthProvisioning={hasAuthProvisioning} />

      <div className="bg-white-warm rounded-2xl border border-ink-20 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-ink-20 flex items-center justify-between">
          <h3 className="font-display text-lg text-ink font-medium">Miembros ({miembros.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-sand/60 text-ink-60 uppercase tracking-wider text-xs">
                <th className="px-4 py-3 font-medium">Persona</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Rol actual</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((m) => (
                <UserRow key={m.id} user={m} currentUserId={user.id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
