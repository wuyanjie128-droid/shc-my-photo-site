import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wjsmfanvwgegazxiqbte.supabase.co";
const supabaseAnonKey = "sb_publishable_3kevU0yLibl-fphV6y_k5w_N1mlz_qX";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);