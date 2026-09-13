import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  console.warn(
    "[auth] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configuradas — login desabilitado."
  );
}

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
