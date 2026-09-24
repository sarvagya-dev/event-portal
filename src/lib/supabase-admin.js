import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase server environment variables. Check .env.local against .env.example."
  );
}

// Server-only Supabase client — uses the service-role key.
// NEVER import this file from client components.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
