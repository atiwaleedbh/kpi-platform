import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Home page - redirects to dashboard if authenticated, otherwise to login
 */
export default async function Home() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }
}
