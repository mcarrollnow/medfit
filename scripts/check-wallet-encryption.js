// Check which wallets have encryption fields populated
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkWallets() {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: wallets, error } = await supabase
    .from('business_wallets')
    .select('id, label, address, currency, encrypted_private_key, private_key_iv, private_key_auth_tag, is_active')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching wallets:', error);
    return;
  }

  console.log(`\nTotal wallets: ${wallets.length}\n`);
  console.log('Wallet Status:');
  console.log('='.repeat(100));

  wallets.forEach((wallet, index) => {
    const hasEncryption = !!(wallet.encrypted_private_key && wallet.private_key_iv && wallet.private_key_auth_tag);
    const status = hasEncryption ? '✅ CAN SEND' : '⚠️  VIEW ONLY (no private key)';
    const activeStatus = wallet.is_active ? 'ACTIVE' : 'INACTIVE';
    
    console.log(`${index + 1}. ${wallet.label} (${wallet.currency})`);
    console.log(`   Address: ${wallet.address}`);
    console.log(`   Status: ${status} - ${activeStatus}`);
    console.log(`   ID: ${wallet.id}`);
    console.log('');
  });

  const withEncryption = wallets.filter(w => w.encrypted_private_key && w.private_key_iv && w.private_key_auth_tag).length;
  const withoutEncryption = wallets.length - withEncryption;

  console.log('='.repeat(100));
  console.log(`Summary: ${withEncryption} wallets can send, ${withoutEncryption} are view-only`);
  
  if (withoutEncryption > 0) {
    console.log('\n⚠️  Warning: Some wallets cannot send transactions.');
    console.log('To fix: Delete and re-import these wallets with their private keys.');
  }
}

checkWallets().catch(console.error);
