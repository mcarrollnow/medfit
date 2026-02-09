-- Fix foreign key constraints on business_wallets and wallet_transactions
-- Run this if you already created the tables with the old schema

-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS business_wallets 
  DROP CONSTRAINT IF EXISTS business_wallets_created_by_fkey;

ALTER TABLE IF EXISTS wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_created_by_fkey;

ALTER TABLE IF EXISTS wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_order_id_fkey;

-- The tables are now fixed and ready to use!
