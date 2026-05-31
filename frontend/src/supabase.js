import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://vnuufbqskgxkpvckqgmd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXVmYnFza2d4a3B2Y2txZ21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTE3NTMsImV4cCI6MjA5NTc4Nzc1M30.ZaOxgosWZdt2RQoB10o2n-nLKHospdmAIdSVgyGxm1U'
)