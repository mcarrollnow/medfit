const { createClient } = require('@supabase/supabase-js')

// Use Supabase URL from environment or hardcoded
const SUPABASE_URL = 'https://bteugdayafihvdzhpnlv.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0ZXVnZGF5YWZpaHZkemhwbmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTA2NzksImV4cCI6MjA3NDkyNjY3OX0.1jHZP7vhDIlIaytBUI-n8K6JY5qJ84LVv50TnBj_6Ms'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkSchema() {
  console.log('Testing shipping_cost...')
  const { error: err1 } = await supabase
    .from('orders')
    .select('shipping_cost')
    .limit(0)
  console.log('shipping_cost:', err1 ? `❌ ${err1.message}` : '✅ EXISTS')

  console.log('\nTesting shipping_amount...')
  const { error: err2 } = await supabase
    .from('orders')
    .select('shipping_amount')
    .limit(0)
  console.log('shipping_amount:', err2 ? `❌ ${err2.message}` : '✅ EXISTS')

  console.log('\nTesting tax_amount...')
  const { error: err3 } = await supabase
    .from('orders')
    .select('tax_amount')
    .limit(0)
  console.log('tax_amount:', err3 ? `❌ ${err3.message}` : '✅ EXISTS')
  
  console.log('\nTesting discount_amount...')
  const { error: err4 } = await supabase
    .from('orders')
    .select('discount_amount')
    .limit(0)
  console.log('discount_amount:', err4 ? `❌ ${err4.message}` : '✅ EXISTS')
}

checkSchema()
