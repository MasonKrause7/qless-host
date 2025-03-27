import { createClient } from '@supabase/supabase-js';



// Create a single supabase client for interacting with the database
const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


const supabase = createClient(supabaseURL, supabaseAnonKey);


export default supabase;