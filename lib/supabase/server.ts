/**
 * Supabase Server Client
 * Use this in Server Components and API Routes
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

/**
 * Create Supabase client for Server Components
 * This reads the user's session from cookies
 */
export function createServerClient() {
  return createServerComponentClient<Database>({ cookies });
}

/**
 * Create Supabase client for API Routes
 * This handles authentication in API routes
 */
export function createRouteClient() {
  return createRouteHandlerClient<Database>({ cookies });
}
