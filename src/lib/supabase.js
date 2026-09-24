import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check .env.local against .env.example."
  );
}

// Client-side Supabase client — uses the public anon key only.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
