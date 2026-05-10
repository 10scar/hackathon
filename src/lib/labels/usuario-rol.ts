import type { UsuarioRol } from "@prisma/client";

export const USUARIO_ROL_LABEL: Record<UsuarioRol, string> = {
  CS_REP: "CS Rep",
  CS_MANAGER: "CS Manager",
  AE: "Account Executive",
  VP: "VP",
};

export function usuarioRolOptions() {
  return (Object.keys(USUARIO_ROL_LABEL) as UsuarioRol[]).map((rol) => ({
    value: rol,
    label: USUARIO_ROL_LABEL[rol],
  }));
}
