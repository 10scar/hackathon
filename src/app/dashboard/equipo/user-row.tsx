"use client";

import { useActionState } from "react";
import { deleteUsuario, updateUsuario, type ActionState } from "./actions";
import { usuarioRolOptions, USUARIO_ROL_LABEL } from "@/lib/labels/usuario-rol";
import type { Usuario, UsuarioRol } from "@prisma/client";

type RowUser = Pick<Usuario, "id" | "nombre" | "email" | "rol">;

const initial: ActionState = null;

export function UserRow({ user, currentUserId }: { user: RowUser; currentUserId: string }) {
  const [updState, updAction, updPending] = useActionState(updateUsuario, initial);
  const [delState, delAction, delPending] = useActionState(deleteUsuario, initial);

  const isSelf = user.id === currentUserId;
  const feedback = updState?.error || updState?.success || delState?.error || delState?.success;

  return (
    <tr className="border-b border-ink-20 last:border-0 hover:bg-cream/80 transition-colors align-top">
      <td className="px-4 py-4">
        <p className="font-medium text-ink">{user.nombre}</p>
        <p className="text-xs text-ink-60 break-all">{user.email}</p>
        {feedback && (
          <p
            className={`text-xs mt-1 ${feedback.includes("eliminado") || updState?.success || delState?.success ? "text-moss" : "text-risk-accent"}`}
          >
            {feedback}
          </p>
        )}
      </td>
      <td className="px-4 py-4 text-sm text-ink-60 hidden sm:table-cell">{USUARIO_ROL_LABEL[user.rol as UsuarioRol]}</td>
      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-stretch gap-2 md:inline-flex md:flex-row md:items-center md:justify-end">
          <form action={updAction} className="flex flex-wrap gap-2 justify-end items-center">
            <input type="hidden" name="id" value={user.id} />
            <input
              name="nombre"
              defaultValue={user.nombre}
              className="px-3 py-1.5 rounded-lg border border-ink-20 bg-white-warm text-sm w-36 max-w-full"
            />
            <select
              name="rol"
              defaultValue={user.rol}
              className="px-3 py-1.5 rounded-lg border border-ink-20 bg-white-warm text-sm"
            >
              {usuarioRolOptions().map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={updPending || isSelf}
              className="text-sm font-medium text-moss hover:text-moss-lt disabled:opacity-40"
            >
              {updPending ? "…" : "Guardar"}
            </button>
          </form>
          <form action={delAction} className="inline">
            <input type="hidden" name="id" value={user.id} />
            <button
              type="submit"
              disabled={delPending || isSelf}
              className="text-sm font-medium text-ink-60 hover:text-risk-accent disabled:opacity-40"
            >
              {delPending ? "…" : "Eliminar"}
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
