import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wfvduonyanoipsubvibs.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_QadlVzslT2SSJkPtiYf5gg_-FJ6Sebl'

export const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
