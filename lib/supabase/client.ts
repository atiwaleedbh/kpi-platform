/**
 * Supabase Client (Browser-side)
 * Use this in Client Components
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export function createClient() {
  return createClientComponentClient<Database>();
}

// Singleton instance for client-side use
export const supabase = createClient();
