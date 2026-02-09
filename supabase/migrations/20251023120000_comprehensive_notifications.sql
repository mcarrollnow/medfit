-- Add notification type enum and update notifications table
ALTER TABLE notifications 
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'support_response',
  ADD COLUMN IF NOT EXISTS related_id UUID,
  ADD COLUMN IF NOT EXISTS action_url TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_related_id ON notifications(related_id);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_related_id UUID DEFAULT NULL,
  p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, related_id, action_url, read, created_at)
  VALUES (p_user_id, p_type, p_title, p_message, p_related_id, p_action_url, false, NOW())
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER 1: Order Status Changes (Shipped)
-- ============================================
CREATE OR REPLACE FUNCTION notify_order_shipped()
RETURNS TRIGGER AS $$
DECLARE
  customer_id UUID;
  customer_name TEXT;
BEGIN
  -- Only notify when status changes TO 'shipped'
  IF NEW.status = 'shipped' AND (OLD.status IS NULL OR OLD.status != 'shipped') THEN
    -- Get customer info
    SELECT c.id, CONCAT(c.first_name, ' ', c.last_name)
    INTO customer_id, customer_name
    FROM customers c
    WHERE c.id = NEW.customer_id;
    
    -- Create notification
    PERFORM create_notification(
      customer_id,
      'order_shipped',
      'Order Shipped! 📦',
      'Your order #' || NEW.order_number || ' has been shipped' || 
        CASE WHEN NEW.tracking_number IS NOT NULL 
        THEN '. Tracking: ' || NEW.tracking_number 
        ELSE '' END,
      NEW.id,
      '/orders'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_order_shipped ON orders;
CREATE TRIGGER trigger_notify_order_shipped
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_shipped();

-- ============================================
-- TRIGGER 2: Order Status Changes (Delivered)
-- ============================================
CREATE OR REPLACE FUNCTION notify_order_delivered()
RETURNS TRIGGER AS $$
DECLARE
  customer_id UUID;
BEGIN
  -- Only notify when status changes TO 'delivered'
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    -- Get customer info
    SELECT c.id INTO customer_id
    FROM customers c
    WHERE c.id = NEW.customer_id;
    
    -- Create notification
    PERFORM create_notification(
      customer_id,
      'order_delivered',
      'Order Delivered! ✅',
      'Your order #' || NEW.order_number || ' has been delivered. Thank you for your business!',
      NEW.id,
      '/orders'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_order_delivered ON orders;
CREATE TRIGGER trigger_notify_order_delivered
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_delivered();

-- ============================================
-- TRIGGER 3: Payment Confirmations
-- ============================================
CREATE OR REPLACE FUNCTION notify_payment_confirmed()
RETURNS TRIGGER AS $$
DECLARE
  customer_id UUID;
  order_total DECIMAL;
BEGIN
  -- Only notify when payment_status changes TO 'paid'
  IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
    -- Get customer info and order total
    SELECT c.id, o.total_amount
    INTO customer_id, order_total
    FROM customers c
    JOIN orders o ON o.id = NEW.id
    WHERE c.id = NEW.customer_id;
    
    -- Create notification
    PERFORM create_notification(
      customer_id,
      'payment_confirmed',
      'Payment Received! 💰',
      'Your payment of $' || ROUND(order_total, 2) || ' for order #' || NEW.order_number || ' has been confirmed.',
      NEW.id,
      '/orders'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_payment_confirmed ON orders;
CREATE TRIGGER trigger_notify_payment_confirmed
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_confirmed();

-- ============================================
-- TRIGGER 4: Wallet Transactions
-- ============================================
CREATE OR REPLACE FUNCTION notify_wallet_transaction()
RETURNS TRIGGER AS $$
DECLARE
  wallet_owner_id UUID;
  transaction_type TEXT;
  amount_display TEXT;
BEGIN
  -- Get wallet owner (from orders assigned to this wallet)
  SELECT DISTINCT c.id
  INTO wallet_owner_id
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  WHERE o.assigned_wallet_address = NEW.wallet_address
  LIMIT 1;
  
  IF wallet_owner_id IS NOT NULL THEN
    -- Determine if incoming or outgoing
    transaction_type := CASE 
      WHEN NEW.type = 'received' THEN 'received ✅'
      ELSE 'sent 📤'
    END;
    
    amount_display := NEW.amount || ' ' || NEW.currency;
    
    -- Create notification
    PERFORM create_notification(
      wallet_owner_id,
      'wallet_transaction',
      'Wallet Transaction',
      'Transaction ' || transaction_type || ': ' || amount_display || 
        CASE WHEN NEW.tx_hash IS NOT NULL 
        THEN ' (TX: ' || SUBSTRING(NEW.tx_hash, 1, 10) || '...)' 
        ELSE '' END,
      NEW.id,
      '/wallet'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if wallet_transactions table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wallet_transactions') THEN
    DROP TRIGGER IF EXISTS trigger_notify_wallet_transaction ON wallet_transactions;
    CREATE TRIGGER trigger_notify_wallet_transaction
      AFTER INSERT ON wallet_transactions
      FOR EACH ROW
      EXECUTE FUNCTION notify_wallet_transaction();
  END IF;
END $$;

-- ============================================
-- TRIGGER 5: Rep Messages
-- ============================================
CREATE OR REPLACE FUNCTION notify_rep_message()
RETURNS TRIGGER AS $$
DECLARE
  customer_id UUID;
  rep_name TEXT;
BEGIN
  -- Only notify customer when rep sends a message
  IF NEW.is_from_customer = false THEN
    -- Get customer ID and rep name
    SELECT 
      cm.customer_id,
      CONCAT(u.first_name, ' ', u.last_name)
    INTO customer_id, rep_name
    FROM customer_messages cm
    LEFT JOIN users u ON u.id = cm.rep_id
    WHERE cm.id = NEW.id;
    
    IF customer_id IS NOT NULL THEN
      -- Create notification
      PERFORM create_notification(
        customer_id,
        'rep_message',
        'Message from ' || COALESCE(rep_name, 'Your Rep'),
        SUBSTRING(NEW.message, 1, 100) || CASE WHEN LENGTH(NEW.message) > 100 THEN '...' ELSE '' END,
        NEW.id,
        '/messages'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if customer_messages table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_messages') THEN
    DROP TRIGGER IF EXISTS trigger_notify_rep_message ON customer_messages;
    CREATE TRIGGER trigger_notify_rep_message
      AFTER INSERT ON customer_messages
      FOR EACH ROW
      EXECUTE FUNCTION notify_rep_message();
  END IF;
END $$;

-- ============================================
-- TRIGGER 6: Order Cancellations
-- ============================================
CREATE OR REPLACE FUNCTION notify_order_cancelled()
RETURNS TRIGGER AS $$
DECLARE
  customer_id UUID;
BEGIN
  -- Only notify when status changes TO 'cancelled'
  IF NEW.status = 'cancelled' AND (OLD.status IS NULL OR OLD.status != 'cancelled') THEN
    -- Get customer info
    SELECT c.id INTO customer_id
    FROM customers c
    WHERE c.id = NEW.customer_id;
    
    -- Create notification
    PERFORM create_notification(
      customer_id,
      'order_cancelled',
      'Order Cancelled',
      'Your order #' || NEW.order_number || ' has been cancelled. If you have questions, please contact support.',
      NEW.id,
      '/orders'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_order_cancelled ON orders;
CREATE TRIGGER trigger_notify_order_cancelled
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_cancelled();

-- ============================================
-- Grant permissions
-- ============================================
GRANT EXECUTE ON FUNCTION create_notification TO service_role;
GRANT EXECUTE ON FUNCTION notify_order_shipped TO service_role;
GRANT EXECUTE ON FUNCTION notify_order_delivered TO service_role;
GRANT EXECUTE ON FUNCTION notify_payment_confirmed TO service_role;
GRANT EXECUTE ON FUNCTION notify_wallet_transaction TO service_role;
GRANT EXECUTE ON FUNCTION notify_rep_message TO service_role;
GRANT EXECUTE ON FUNCTION notify_order_cancelled TO service_role;
