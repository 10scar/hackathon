import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Admin (service role). Solo en servidor; nunca exportar la key al cliente.
 * Si `SUPABASE_SERVICE_ROLE_KEY` no está definido, algunas operaciones (crear usuario con login) no estarán disponibles.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function canManageAuthUsers() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
