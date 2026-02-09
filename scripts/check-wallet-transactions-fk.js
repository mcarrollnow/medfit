const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkConstraint() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT 
        conname as constraint_name,
        confdeltype as on_delete_action
      FROM pg_constraint
      WHERE conname = 'wallet_transactions_order_id_fkey';
    `
  });

  if (error) {
    // Try direct query instead
    const result = await supabase
      .from('wallet_transactions')
      .select('*')
      .limit(1);
    
    console.log('Current wallet_transactions schema:', result);
    return;
  }

  console.log('Foreign key constraint info:', data);
}

checkConstraint();
