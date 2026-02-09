/**
 * Test script for AI Agent Support System
 * Run with: node scripts/test-ai-agent.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAIAgent() {
  console.log('🤖 Testing AI Agent Support System\n');

  // 1. Check database tables exist
  console.log('1. Checking database tables...');
  
  const tables = [
    'support_tickets',
    'ticket_messages', 
    'ai_proposed_actions',
    'ai_ticket_activity'
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`   ❌ Table '${table}' not found or inaccessible`);
      console.log(`      Error: ${error.message}`);
    } else {
      console.log(`   ✅ Table '${table}' exists`);
    }
  }

  // 2. Check AI fields on support_tickets
  console.log('\n2. Checking AI fields on support_tickets...');
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .select('ai_handling, ai_escalated, escalation_reason, ai_summary, last_ai_action_at')
    .limit(1)
    .single();

  if (ticketError && ticketError.code !== 'PGRST116') {
    console.log('   ❌ AI fields missing on support_tickets');
    console.log('   Run migration: supabase/migrations/add_ai_agent_system.sql');
  } else {
    console.log('   ✅ AI fields present on support_tickets');
  }

  // 3. Check is_ai field on ticket_messages
  console.log('\n3. Checking is_ai field on ticket_messages...');
  const { data: message, error: messageError } = await supabase
    .from('ticket_messages')
    .select('is_ai')
    .limit(1)
    .single();

  if (messageError && messageError.code !== 'PGRST116') {
    console.log('   ❌ is_ai field missing on ticket_messages');
  } else {
    console.log('   ✅ is_ai field present on ticket_messages');
  }

  // 4. Check environment variables
  console.log('\n4. Checking environment variables...');
  const requiredEnvVars = [
    'ANTHROPIC_API_KEY',
    'VITE_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`   ✅ ${envVar} is set`);
    } else {
      console.log(`   ❌ ${envVar} is missing`);
    }
  }

  // 5. Test agent tools file exists
  console.log('\n5. Checking agent tools...');
  try {
    const tools = require('../api/tickets/agent-tools');
    const toolNames = Object.keys(tools).filter(k => k !== 'getToolsRequiringApproval');
    console.log(`   ✅ Agent tools loaded: ${toolNames.length} tools available`);
    console.log(`      Tools: ${toolNames.slice(0, 5).join(', ')}...`);
  } catch (err) {
    console.log('   ❌ Failed to load agent tools');
    console.log(`      Error: ${err.message}`);
  }

  // 6. Check API endpoints exist
  console.log('\n6. Checking API endpoints...');
  const fs = require('fs');
  const endpoints = [
    'api/tickets/[id]/agent-stream.js',
    'api/admin/proposed-actions.js',
    'api/tickets/agent-tools.js'
  ];

  for (const endpoint of endpoints) {
    if (fs.existsSync(endpoint)) {
      console.log(`   ✅ ${endpoint} exists`);
    } else {
      console.log(`   ❌ ${endpoint} not found`);
    }
  }

  // 7. Summary
  console.log('\n📊 Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('If all checks passed, your AI Agent system is ready!');
  console.log('\nNext steps:');
  console.log('1. Deploy to production');
  console.log('2. Test with a real support ticket');
  console.log('3. Monitor proposed actions dashboard');
  console.log('\nDocumentation: AI_AGENT_SUPPORT_GUIDE.md');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testAIAgent().catch(console.error);
