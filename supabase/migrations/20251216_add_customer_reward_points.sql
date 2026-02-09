-- Add reward points columns to customers table
-- This enables tracking customer reward points for the rewards system

-- Add reward_points column (current available balance)
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS reward_points INTEGER DEFAULT 0;

-- Add lifetime_points_earned for tracking total points ever earned (used by trigger)
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS lifetime_points_earned INTEGER DEFAULT 0;

-- Add total_points_earned for tracking lifetime points earned
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS total_points_earned INTEGER DEFAULT 0;

-- Add total_points_redeemed for tracking lifetime points spent
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS total_points_redeemed INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN customers.reward_points IS 'Current available reward points balance for the customer';
COMMENT ON COLUMN customers.lifetime_points_earned IS 'Total lifetime reward points earned (updated by trigger)';
COMMENT ON COLUMN customers.total_points_earned IS 'Total lifetime reward points earned by the customer';
COMMENT ON COLUMN customers.total_points_redeemed IS 'Total lifetime reward points redeemed by the customer';

-- Create index for faster queries on reward_points
CREATE INDEX IF NOT EXISTS idx_customers_reward_points ON customers(reward_points);

-- Create a trigger that updates reward_points when points_adjustments are made
CREATE OR REPLACE FUNCTION update_customer_reward_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the customer's reward_points based on the adjustment
  UPDATE customers
  SET
    reward_points = COALESCE(reward_points, 0) + NEW.points_amount,
    lifetime_points_earned = CASE
      WHEN NEW.points_amount > 0
      THEN COALESCE(lifetime_points_earned, 0) + NEW.points_amount
      ELSE COALESCE(lifetime_points_earned, 0)
    END,
    total_points_earned = CASE
      WHEN NEW.points_amount > 0
      THEN COALESCE(total_points_earned, 0) + NEW.points_amount
      ELSE COALESCE(total_points_earned, 0)
    END,
    total_points_redeemed = CASE
      WHEN NEW.points_amount < 0
      THEN COALESCE(total_points_redeemed, 0) + ABS(NEW.points_amount)
      ELSE COALESCE(total_points_redeemed, 0)
    END,
    updated_at = NOW()
  WHERE id = NEW.customer_id;

  -- Update the new balance on the adjustment record
  UPDATE points_adjustments
  SET new_balance = (SELECT reward_points FROM customers WHERE id = NEW.customer_id)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (drop first if exists)
DROP TRIGGER IF EXISTS trigger_update_customer_reward_points ON points_adjustments;
CREATE TRIGGER trigger_update_customer_reward_points
AFTER INSERT ON points_adjustments
FOR EACH ROW
EXECUTE FUNCTION update_customer_reward_points();

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
