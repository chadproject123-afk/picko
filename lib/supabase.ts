import { createClient } from '@supabase/supabase-js'
import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 서버 사이드용 (Server Actions, API routes)
export const supabase = createClient(supabaseUrl, supabaseKey)

// 브라우저용 (Client Components)
export function createBrowserSupabaseClient() {
    return createSupabaseBrowserClient(supabaseUrl, supabaseKey)
}
