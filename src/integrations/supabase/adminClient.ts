// This file is for admin operations that require elevated permissions
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tqjvynnnxporpqetdtln.supabase.co";
// IMPORTANT: This key should be kept secure and not exposed to the client
// In a production environment, this should be stored in environment variables
// and only used in server-side code
const SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"; // Replace with your actual service role key

// Create a Supabase client with the service role key
// This client has elevated permissions and can bypass RLS
export const adminClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
); 