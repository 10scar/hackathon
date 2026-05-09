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
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-montserrat font-bold text-3xl text-secondary">Mis Clientes</h2>
        <p className="text-text-muted">Lista operativa de cuentas monitoreadas.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="px-6 py-4 font-semibold text-sm text-secondary">Cliente</th>
              <th className="px-6 py-4 font-semibold text-sm text-secondary">MRR</th>
              <th className="px-6 py-4 font-semibold text-sm text-secondary">Renovación</th>
              <th className="px-6 py-4 font-semibold text-sm text-secondary">Health Score</th>
              <th className="px-6 py-4 font-semibold text-sm text-secondary">Alertas</th>
              <th className="px-6 py-4 font-semibold text-sm text-secondary text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clientesOrdenados.map((cliente) => {
              const score = cliente.health_scores[0]?.score || 100;
              const hasAlerts = cliente.alertas.length > 0;
              const isLinea2 = cliente.alertas.some(a => a.linea_deteccion === 'LINEA_2');

              return (
                <tr key={cliente.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-text-main">{cliente.nombre}</p>
                    <p className="text-xs text-text-muted">{cliente.etapa_ciclo}</p>
                  </td>
                  <td className="px-6 py-4 text-text-main font-medium">
                    ${Number(cliente.mrr).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-text-muted text-sm">
                    {cliente.dias_para_renovacion} días
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${score <= 45 ? 'text-error' : score <= 75 ? 'text-warning' : 'text-primary'}`}>
                        {score}
                      </span>
                      {/* Mini barra */}
                      <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${score <= 45 ? 'bg-error' : score <= 75 ? 'bg-warning' : 'bg-primary'}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {hasAlerts ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isLinea2 ? 'bg-error text-white' : 'bg-warning/20 text-warning'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        {isLinea2 ? 'Crítica' : 'Tendencia'}
                      </span>
                    ) : (
                      <span className="text-text-muted text-sm">Ninguna</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-secondary font-semibold text-sm transition-colors">
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
