import { prisma } from "@/lib/prisma";
import { EmpresaTier, UsuarioRol } from "@prisma/client";
import { DUMMY_CLIENTES } from "./dummy-data";

export async function injectDummiesForTenant(supabaseUserId: string, empresaNombre: string, usuarioNombre: string) {
  // 1. Crear Empresa
  const empresa = await prisma.empresa.create({
    data: {
      nombre: empresaNombre,
      industria: "SaaS",
      tier: EmpresaTier.ENTERPRISE,
    }
  });

  // 2. Crear Usuario logueado asociado a la empresa y usando el ID de Supabase
  const usuario = await prisma.usuario.create({
    data: {
      id: supabaseUserId, // Usamos el UUID de Supabase Auth
      empresa_id: empresa.id,
      nombre: usuarioNombre,
      email: `${usuarioNombre}@${empresaNombre.replace(/\s+/g, '').toLowerCase()}.com`,
      rol: UsuarioRol.CS_MANAGER,
    }
  });

  // 3. Crear Clientes Dummies iterando sobre el JSON
  for (const dummy of DUMMY_CLIENTES) {
    const cliente = await prisma.cliente.create({
      data: {
        empresa_id: empresa.id,
        nombre: dummy.nombre,
        mrr: dummy.mrr,
        etapa_ciclo: dummy.etapa_ciclo,
        dias_para_renovacion: dummy.dias_para_renovacion,
      }
    });

    // Insertar Health Scores
    for (const hs of dummy.health_scores) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + hs.offsetDays);
      await prisma.healthScore.create({
        data: {
          cliente_id: cliente.id,
          score: hs.score,
          estado_salud: hs.estado_salud,
          fecha_registro: fecha,
        }
      });
    }

    // Insertar Contactos
    for (const contacto of dummy.contactos) {
      await prisma.contacto.create({
        data: {
          cliente_id: cliente.id,
          nombre: contacto.nombre,
          rol_cuenta: contacto.rol_cuenta,
          estado_actual: contacto.estado_actual,
          dias_sin_login: contacto.dias_sin_login,
        }
      });
    }

    // Insertar Señales
    for (const senal of dummy.senales) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + senal.offsetDays);
      await prisma.senal.create({
        data: {
          cliente_id: cliente.id,
          tipo: senal.tipo,
          descripcion: senal.descripcion,
          es_critica: senal.es_critica,
          fecha_creacion: fecha,
        }
      });
    }

    // Insertar Alertas
    for (const alerta of dummy.alertas) {
      const sla = new Date();
      sla.setMinutes(sla.getMinutes() + alerta.slaOffsetMins);
      await prisma.alertaIntervencion.create({
        data: {
          cliente_id: cliente.id,
          asignado_a: usuario.id,
          linea_deteccion: alerta.linea_deteccion,
          emocion_detectada: alerta.emocion_detectada,
          tipo_output: alerta.tipo_output,
          mensaje_generado: alerta.mensaje_generado,
          nota_interna: alerta.nota_interna,
          estado: alerta.estado,
          sla_vencimiento: sla,
        }
      });
    }
  }

  return { empresa, usuario };
}
