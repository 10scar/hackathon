import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.usuario.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) return null;

  // Obtener clientes con su score más reciente
  const clientes = await prisma.cliente.findMany({
    where: { empresa_id: dbUser.empresa_id },
    include: {
      health_scores: {
        orderBy: { fecha_registro: 'desc' },
        take: 1
      },
      alertas: {
        where: { estado: 'PENDIENTE' }
      }
    }
  });

  // Ordenar por score (menor a mayor para ver urgencias primero)
  const clientesOrdenados = clientes.sort((a, b) => {
    const scoreA = a.health_scores[0]?.score || 100;
    const scoreB = b.health_scores[0]?.score || 100;
    return scoreA - scoreB;
  });

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 font-sans">
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-medium text-4xl text-ink">Mis Clientes</h2>
        <p className="text-ink-60">Lista operativa de cuentas monitoreadas.</p>
      </div>

      <div className="bg-white-warm rounded-2xl shadow-card border border-ink-20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sand border-b border-ink-20">
              <th className="px-6 py-4 font-medium text-sm text-ink-60 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-4 font-medium text-sm text-ink-60 uppercase tracking-wider">MRR</th>
              <th className="px-6 py-4 font-medium text-sm text-ink-60 uppercase tracking-wider">Renovación</th>
              <th className="px-6 py-4 font-medium text-sm text-ink-60 uppercase tracking-wider">Health Score</th>
              <th className="px-6 py-4 font-medium text-sm text-ink-60 uppercase tracking-wider">Alertas</th>
              <th className="px-6 py-4 font-medium text-sm text-ink-60 uppercase tracking-wider text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-20">
            {clientesOrdenados.map((cliente) => {
              const score = cliente.health_scores[0]?.score || 100;
              const hasAlerts = cliente.alertas.length > 0;
              const isLinea2 = cliente.alertas.some(a => a.linea_deteccion === 'LINEA_2');

              return (
                <tr key={cliente.id} className="hover:bg-cream transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">{cliente.nombre}</p>
                    <p className="text-xs text-ink-60">{cliente.etapa_ciclo}</p>
                  </td>
                  <td className="px-6 py-4 text-ink font-medium">
                    ${Number(cliente.mrr).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-ink-60 text-sm">
                    {cliente.dias_para_renovacion} días
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${score <= 45 ? 'text-rust' : score <= 75 ? 'text-moss' : 'text-leaf'}`}>
                        {score}
                      </span>
                      {/* Mini barra */}
                      <div className="w-16 h-2 bg-sand rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${score <= 45 ? 'bg-rust' : score <= 75 ? 'bg-moss' : 'bg-leaf'}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {hasAlerts ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isLinea2 ? 'bg-risk-accent text-white-warm' : 'bg-rust/10 text-rust border border-rust/20'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        {isLinea2 ? 'Crítica' : 'Tendencia'}
                      </span>
                    ) : (
                      <span className="text-ink-60 text-sm">Ninguna</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-moss hover:text-moss-lt font-medium text-sm transition-colors border-b border-transparent hover:border-moss-lt">
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
