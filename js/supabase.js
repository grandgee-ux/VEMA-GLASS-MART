
// GLASS MART - SUPABASE CONNECTION

const SUPABASE_URL = "https://pnionhyyndlyvzhqdnta.supabase.co/rest/v1/";

const SUPABASE_KEY = "sb_publishable_yzp0DD0g3DrP5T2F1Tcxag_iJK3CYf4";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
