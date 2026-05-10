import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Obtener datos globales de la empresa
  const dbUser = await prisma.usuario.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) return null;

  // Resumen general
  const clientes = await prisma.cliente.findMany({
    where: { empresa_id: dbUser.empresa_id },
    include: {
      alertas: {
        where: { estado: 'PENDIENTE' }
      }
    }
  });

  const mrrTotal = clientes.reduce((sum, c) => sum + Number(c.mrr), 0);
  
  // Clientes en Riesgo (Línea 2)
  const clientesEnRiesgo = clientes.filter(c => 
    c.alertas.some(a => a.linea_deteccion === 'LINEA_2')
  );

  const mrrEnRiesgo = clientesEnRiesgo.reduce((sum, c) => sum + Number(c.mrr), 0);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-montserrat font-bold text-3xl text-secondary">Vista Gerencial</h2>
        <p className="text-text-muted">Resumen del estado de salud de tu cartera de clientes.</p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col">
          <p className="text-text-muted font-semibold text-sm mb-2">MRR en Riesgo (Línea 2)</p>
          <p className="font-montserrat font-bold text-4xl text-error mb-2">
            ${mrrEnRiesgo.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted">
            De un total de ${mrrTotal.toLocaleString()} ({((mrrEnRiesgo/mrrTotal)*100).toFixed(1)}%)
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col">
          <p className="text-text-muted font-semibold text-sm mb-2">Alertas Pendientes</p>
          <p className="font-montserrat font-bold text-4xl text-secondary mb-2">
             {clientes.flatMap(c => c.alertas).length}
          </p>
          <p className="text-xs text-primary font-medium bg-surface inline-block px-2 py-1 rounded-md mt-auto self-start border border-primary/20">
            Requieren atención
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col">
          <p className="text-text-muted font-semibold text-sm mb-2">Horas Ahorradas (Estimadas)</p>
          <p className="font-montserrat font-bold text-4xl text-primary mb-2">
            18h
          </p>
          <p className="text-xs text-text-muted mt-auto">
             Gracias a la detección automática esta semana.
          </p>
        </div>
      </div>

      {/* Gráfico Simplificado usando CSS/Tailwind */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-border mt-4">
         <h3 className="font-montserrat font-semibold text-xl text-secondary mb-6">Tendencia de Riesgo (Últimos 30 días)</h3>
         <div className="h-64 flex items-end gap-4 border-b border-l border-border pl-4 pb-4 pt-4">
           {/* Simulamos barras */}
           {[10, 20, 15, 30, 25, 40, 35, 50, 45, 60, 20, 10, 5, 12, 8].map((h, i) => (
             <div key={i} className="flex-1 bg-surface relative group rounded-t-sm hover:bg-primary/20 transition-colors" style={{ height: `${h}%` }}>
                {h > 40 && <div className="absolute top-0 inset-x-0 h-1 bg-error"></div>}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap">
                  Riesgo: {h}%
                </div>
             </div>
           ))}
         </div>
         <div className="flex justify-between text-xs text-text-muted mt-2 font-medium px-4">
           <span>Hace 30 días</span>
           <span>Hoy</span>
         </div>
      </div>

    </div>
  );
}
