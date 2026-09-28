import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nbkxldwgpqluaozkzeck.supabase.co'
const supabaseKey = 'sb_publishable_8rdNkeTvRqkjQYNDzxB4ew_jDA8Maj9'

export const supabase = createClient(supabaseUrl, supabaseKey)