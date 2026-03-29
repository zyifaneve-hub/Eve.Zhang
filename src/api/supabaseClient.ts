import { createClient } from '@supabase/supabase-js';

// Default to empty strings to avoid crashes during build/SSR if not provided
const supabaseUrl = 'https://amnkzxgohakvuxhueoir.supabase.co';
const supabaseKey = 'sb_publishable_qtNMghjx8kwHHViBFLeDcQ_4RboeN4a';

export const supabase = createClient(supabaseUrl, supabaseKey);
