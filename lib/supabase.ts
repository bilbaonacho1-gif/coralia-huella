import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
    throw new Error("Faltan las variables SUPABASE_URL o SUPABASE_SECRET_KEY");
}

export const supabase = createClient(url, key);